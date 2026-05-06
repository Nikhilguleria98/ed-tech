'use client'
import { useEffect, useState } from "react";
import api from "../../../services/api";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const res = await api.get("/user/my-courses");
      setCourses(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 mt-10">
      <h1 className="text-2xl mb-6 font-bold">My Purchased Courses</h1>

      {courses.length === 0 ? (
        <p className="text-gray-400">No courses purchased yet</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
            >
              <img
                src={course.thumbnail}
                className="h-40 w-full object-cover"
              />

              <div className="p-4">
                <h2 className="font-semibold">{course.courseName}</h2>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                  {course.courseDescription}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}