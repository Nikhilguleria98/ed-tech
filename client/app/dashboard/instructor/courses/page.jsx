'use client'
import { useEffect, useState } from "react";
import api from "../../../services/api";
import { useRouter } from "next/navigation";

export default function InstructorCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/course/instructor-courses");
      setCourses(res.data.data);
    } catch (err) {
      console.log(err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (!confirm("Delete this course?")) return;

    try {
      await api.delete(`/course/${courseId}`);
      setCourses(prev => prev.filter(c => c._id !== courseId));
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = async (course) => {
    const newName = prompt("New name", course.courseName);
    if (!newName) return;

    await api.put(`/course/${course._id}`, {
      courseName: newName,
      price: course.price,
    });

    fetchCourses();
  };

  if (loading) return <p className="text-white">Loading...</p>;

  return (
    <div className="p-6 text-white">

      <div className="flex justify-between mb-8 mt-10">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <a href="/dashboard/instructor/add-course"
          className="bg-indigo-500 px-4 py-2 rounded-lg">
          + Add Course
        </a>
      </div>

      {courses.length === 0 ? (
        <p className="text-center text-gray-400 mt-20">
          No courses yet 😢
        </p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {courses.map((c) => (
            <div key={c._id} className="bg-white/5 rounded-xl p-4">

              <img src={c.thumbnail} className="h-40 w-full object-cover"/>

              <h2 className="mt-3">{c.courseName}</h2>

              <p className="text-indigo-400">₹{c.price}</p>

              <div className="flex gap-2 mt-3">
                <button onClick={() => handleEdit(c)}
                  className="bg-indigo-500 px-3 py-1 rounded">
                  Edit
                </button>

                <button onClick={() => handleDelete(c._id)}
                  className="bg-red-500 px-3 py-1 rounded">
                  Delete
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}