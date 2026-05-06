'use client'

import { useEffect, useState } from "react";
import api from "../../../services/api";

export default function Profile() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    contactNumber: "",
    about: "",
    gender: "",
  });

  const [preview, setPreview] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    let ignore = false;

    api.get("/user/me")
      .then((res) => {
        if (!ignore) {
          const user = res.data.data;

          setForm({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            dateOfBirth: user.additionalDetails?.dateOfBirth || "",
            contactNumber: user.additionalDetails?.contactNumber || "",
            about: user.additionalDetails?.about || "",
            gender: user.additionalDetails?.gender || "",
          });

          setPreview(user.image);
          localStorage.setItem("user", JSON.stringify(user));
        }
      })
      .catch((err) => {
        console.log(err);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(form).forEach((key) => data.append(key, form[key]));
    if (image) data.append("image", image);

    try {
      const res = await api.put("/user/update-profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      localStorage.setItem("user", JSON.stringify(res.data.data));
      setEditMode(false);
    } catch (err) {
      console.log(err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-4 sm:px-6 md:px-10 py-6 flex justify-center">
      <div className="w-full max-w-6xl">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 mt-10">
          <h1 className="text-2xl sm:text-3xl font-bold">My Profile</h1>

          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="w-full sm:w-auto bg-indigo-500 px-4 py-2 rounded-lg"
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* LEFT CARD */}
          <div className="bg-white/5 p-5 sm:p-6 rounded-2xl border text-center">

            <img
              src={preview}
              className="w-32 h-32 rounded-full mx-auto object-cover border"
            />

            {editMode && (
              <input
                type="file"
                onChange={handleImage}
                className="mt-4 text-sm"
              />
            )}

            <h2 className="mt-4 text-lg sm:text-xl font-semibold">
              {form.firstName} {form.lastName}
            </h2>

            <p className="text-gray-400 text-sm break-all">
              {form.email}
            </p>
          </div>

          {/* RIGHT SECTION */}
          <div className="md:col-span-2 bg-white/5 p-5 sm:p-6 rounded-2xl border">

            {!editMode ? (
              // VIEW MODE
              <div className="space-y-4 text-sm sm:text-base">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <p><b>First Name:</b> {form.firstName}</p>
                  <p><b>Last Name:</b> {form.lastName}</p>
                </div>

                <p><b>Contact:</b> {form.contactNumber || "Not added"}</p>
                <p><b>Gender:</b> {form.gender || "Not selected"}</p>
                <p><b>DOB:</b> {form.dateOfBirth || "Not added"}</p>

                <p>
                  <b>About:</b><br />
                  <span className="text-gray-400 text-sm sm:text-base">
                    {form.about || "No description added"}
                  </span>
                </p>

              </div>
            ) : (
              // EDIT MODE
              <form onSubmit={handleUpdate} className="space-y-4">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input name="firstName" value={form.firstName} onChange={handleChange} className="input" />
                  <input name="lastName" value={form.lastName} onChange={handleChange} className="input" />
                </div>

                <input value={form.email} disabled className="input w-full" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} className="input" />
                  <input name="contactNumber" value={form.contactNumber} onChange={handleChange} className="input" />
                </div>

                <select name="gender" value={form.gender} onChange={handleChange} className="input w-full">
                  <option value="">Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>

                <textarea
                  name="about"
                  value={form.about}
                  onChange={handleChange}
                  className="input w-full h-28"
                  placeholder="About you"
                />

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    disabled={loading}
                    className="w-full sm:flex-1 bg-indigo-500 py-3 rounded-lg"
                  >
                    {loading ? "Updating..." : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="w-full sm:flex-1 bg-gray-600 py-3 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
