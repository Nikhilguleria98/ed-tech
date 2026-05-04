'use client'
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "../../../../services/api";

export default function EditCourse() {
  const { id } = useParams();
  const router = useRouter();

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
  const [loading, setLoading] = useState(false);

  // ✅ FETCH COURSE DETAILS
  useEffect(() => {
    fetchCourse();
    fetchTags();
  }, []);

  const fetchCourse = async () => {
    try {
      const res = await api.post("/course/details", {
        courseId: id,
      });

      const course = res.data.data[0];

      setForm({
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        whatYouWillLearn: course.whatYouWillLearn,
        price: course.price,
        tag: course.tag?._id,
        thumbnail: null,
      });

      setPreview(course.thumbnail);

    } catch (err) {
      console.log(err);
    }
  };

  // ✅ FETCH TAGS
  const fetchTags = async () => {
    try {
      const res = await api.get("/tag/all");
      setTags(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "thumbnail") {
      const file = e.target.files[0];
      setForm({ ...form, thumbnail: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  // ✅ UPDATE COURSE
 const handleUpdate = async (e) => {
  e.preventDefault();
  setLoading(true);

  const data = new FormData();
  data.append("courseId", id);

  Object.keys(form).forEach((key) => {
    if (form[key] !== null) {
      data.append(key, form[key]);
    }
  });

  try {
    await api.put("/course/update", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    router.push("/dashboard/instructor");

  } catch (err) {
    console.log(err.response?.data);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 flex justify-center">
      <div className="w-full max-w-4xl">

        <h1 className="text-3xl font-bold mb-6">Edit Course</h1>

        <form
          onSubmit={handleUpdate}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6"
        >

          {/* Course Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <input
              name="courseName"
              value={form.courseName}
              onChange={handleChange}
              className="input"
            />

            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              className="input"
            />
          </div>

          {/* TAG */}
          <select
            name="tag"
            value={form.tag}
            onChange={handleChange}
            className="input w-full bg-[#020617]"
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
            value={form.courseDescription}
            onChange={handleChange}
            className="input w-full h-28"
          />

          <textarea
            name="whatYouWillLearn"
            value={form.whatYouWillLearn}
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
            className={`w-full py-3 rounded-lg ${
              loading
                ? "bg-gray-500"
                : "bg-gradient-to-r from-indigo-500 to-purple-500"
            }`}
          >
            {loading ? "Updating..." : "Update Course"}
          </button>

        </form>
      </div>
    </div>
  );
}