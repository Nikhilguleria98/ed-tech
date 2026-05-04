'use client';

import { useEffect, useState } from "react";
import api from "../services/api";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : null;

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/course/all");
      setCourses(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (courseId) => {
    try {
      await api.post("/course/purchase", { courseId });
      alert("Course purchased successfully 🎉");
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  if (loading) return <p className="text-white">Loading...</p>;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">

      <h1 className="text-3xl font-bold mb-6">All Courses</h1>

      <div className="grid md:grid-cols-3 gap-6">

        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
          >

            {/* IMAGE */}
            <img
              src={course.thumbnail}
              className="h-40 w-full object-cover"
            />

            <div className="p-4">

              <h2 className="text-lg font-semibold">
                {course.courseName}
              </h2>

              <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                {course.courseDescription}
              </p>

              <p className="mt-2 text-indigo-400 font-bold">
                ₹{course.price}
              </p>

              {/* 🎯 ROLE BASED BUTTON */}
              {user?.accountType === "Instructor" ? (
                <p className="mt-4 text-sm text-yellow-400">
                  You are an instructor (cannot purchase courses)
                </p>
              ) : (
                <button
                  onClick={() => handleBuy(course._id)}
                  className="w-full mt-4 bg-indigo-500 py-2 rounded-lg hover:bg-indigo-600"
                >
                  Buy Now
                </button>
              )}

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}