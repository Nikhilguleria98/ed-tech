'use client'
import { useEffect, useState } from "react";
import api from "../../../services/api";

export default function AddCourse() {
  const [form, setForm] = useState({
    courseName: "",
    courseDescription: "",
    whatYouWillLearn: "",
    price: "",
    tag: "",
    thumbnail: null,
  });

  const [tags, setTags] = useState([]);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false); // ✅ NEW

  // FETCH TAGS
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await api.get("/tag/all");
        setTags(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchTags();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "thumbnail") {
      const file = e.target.files[0];
      setForm({ ...form, thumbnail: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); // ✅ START LOADING

    const data = new FormData();
    Object.keys(form).forEach((key) => {
      data.append(key, form[key]);
    });

    try {
      await api.post("/course/create", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Course created 🚀");

      // RESET FORM
      setForm({
        courseName: "",
        courseDescription: "",
        whatYouWillLearn: "",
        price: "",
        tag: "",
        thumbnail: null,
      });
      setPreview(null);

    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false); // ✅ STOP LOADING
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 flex justify-center">
      <div className="w-full max-w-4xl mt-10">

        <h1 className="text-3xl font-bold mb-6">Create New Course</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6"
        >

          {/* Course Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <input name="courseName" placeholder="Course Name" onChange={handleChange} className="input" />
            <input name="price" placeholder="Price (₹)" onChange={handleChange} className="input" />
          </div>

          {/* TAG DROPDOWN */}
          <select
            name="tag"
            onChange={handleChange}
            className="input w-full mt-4 bg-[#020617]"
          >
            <option value="">Select Category</option>
            {tags.map((tag) => (
              <option key={tag._id} value={tag._id}>
                {tag.name}
              </option>
            ))}
          </select>

          {/* Description */}
          <textarea
            name="courseDescription"
            placeholder="Course Description"
            onChange={handleChange}
            className="input w-full h-28"
          />

          <textarea
            name="whatYouWillLearn"
            placeholder="What students will learn"
            onChange={handleChange}
            className="input w-full h-28"
          />

          {/* Thumbnail */}
          <label className="block border-2 border-dashed p-6 rounded-xl cursor-pointer">
            {preview ? (
              <img src={preview} className="h-40 w-full object-cover rounded" />
            ) : (
              <p className="text-gray-400">Upload Thumbnail</p>
            )}
            <input type="file" name="thumbnail" onChange={handleChange} hidden />
          </label>

          {/* BUTTON */}
          <button
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-[1.02]"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Creating...
              </span>
            ) : (
              "🚀 Create Course"
            )}
          </button>

        </form>
      </div>
    </div>
  );
}