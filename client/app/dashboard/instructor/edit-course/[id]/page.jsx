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
  const [sections, setSections] = useState([]);
  const [sectionName, setSectionName] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sectionLoading, setSectionLoading] = useState(false);

  useEffect(() => {
    let ignore = false;

    api.get(`/course/${id}`)
      .then((res) => {
        if (!ignore) {
          const course = res.data.data;

          setForm({
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            whatYouWillLearn: course.whatYouWillLearn,
            price: course.price,
            tag: course.tag?._id || course.tag,
            thumbnail: null,
          });
          setPreview(course.thumbnail);
          setSections(course.courseContent || []);
        }
      })
      .catch((err) => {
        console.log(err.response?.data || err);
      });

    api.get("/tag/all")
      .then((res) => {
        if (!ignore) {
          setTags(res.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  const handleChange = (e) => {
    if (e.target.name === "thumbnail") {
      const file = e.target.files[0];
      setForm({ ...form, thumbnail: file });
      setPreview(URL.createObjectURL(file));
      return;
    }

    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key] !== null) {
        data.append(key, form[key]);
      }
    });

    try {
      await api.put(`/course/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      router.push("/dashboard/instructor/courses");
    } catch (err) {
      console.log(err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSection = async (e) => {
    e.preventDefault();
    if (!sectionName.trim()) return;

    setSectionLoading(true);
    try {
      const res = await api.post("/section/create", {
        sectionName,
        courseId: id,
      });

      const createdSectionId = res.data.updatedCourseDetails?.courseContent?.at(-1);
      const newSection = createdSectionId
        ? { _id: createdSectionId, sectionName }
        : { _id: Date.now().toString(), sectionName };

      setSections((prev) => [...prev, newSection]);
      setSectionName("");
    } catch (err) {
      console.log(err.response?.data || err);
    } finally {
      setSectionLoading(false);
    }
  };

  const handleRenameSection = async (section) => {
    const nextName = prompt("Rename section", section.sectionName);
    if (!nextName || nextName === section.sectionName) return;

    try {
      await api.put("/section/update", {
        sectionId: section._id,
        sectionName: nextName,
      });
      setSections((prev) =>
        prev.map((item) =>
          item._id === section._id ? { ...item, sectionName: nextName } : item
        )
      );
    } catch (err) {
      console.log(err.response?.data || err);
    }
  };

  const handleDeleteSection = async (sectionId) => {
    try {
      await api.delete(`/section/${sectionId}`);
      setSections((prev) => prev.filter((section) => section._id !== sectionId));
    } catch (err) {
      console.log(err.response?.data || err);
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
          <div className="grid md:grid-cols-2 gap-4">
            <input name="courseName" value={form.courseName} onChange={handleChange} className="input" />
            <input name="price" value={form.price} onChange={handleChange} className="input" />
          </div>

          <select name="tag" value={form.tag} onChange={handleChange} className="input w-full bg-[#020617]">
            <option value="">Select Category</option>
            {tags.map((tag) => (
              <option key={tag._id} value={tag._id}>
                {tag.name}
              </option>
            ))}
          </select>

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

          <label className="block border-2 border-dashed p-6 rounded-xl cursor-pointer">
            {preview ? (
              <img src={preview} alt="Course thumbnail preview" className="h-40 w-full object-cover rounded" />
            ) : (
              <p className="text-gray-400">Upload Thumbnail</p>
            )}
            <input type="file" name="thumbnail" onChange={handleChange} hidden />
          </label>

          <button
            disabled={loading}
            className={`w-full py-3 rounded-lg ${
              loading ? "bg-gray-500" : "bg-gradient-to-r from-indigo-500 to-purple-500"
            }`}
          >
            {loading ? "Updating..." : "Update Course"}
          </button>
        </form>

        <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4">Course Sections</h2>

          <form onSubmit={handleAddSection} className="flex gap-3 mb-6">
            <input
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              placeholder="Add section name"
              className="input flex-1"
            />
            <button
              type="submit"
              disabled={sectionLoading}
              className="px-4 py-2 rounded-lg bg-indigo-500"
            >
              {sectionLoading ? "Adding..." : "Add Section"}
            </button>
          </form>

          <div className="space-y-3">
            {sections.length ? sections.map((section, index) => (
              <div
                key={section._id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3"
              >
                <div>
                  <p className="text-sm text-gray-400">Section {index + 1}</p>
                  <p className="font-medium">{section.sectionName}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleRenameSection(section)}
                    className="rounded-lg bg-indigo-500 px-3 py-1"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteSection(section._id)}
                    className="rounded-lg bg-red-500 px-3 py-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )) : (
              <p className="text-gray-400">No sections added yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
