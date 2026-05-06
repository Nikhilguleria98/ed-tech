'use client'
import { useEffect, useState } from "react";
import api from "../../../services/api";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    let ignore = false;

    api.get("/user/my-courses")
      .then((res) => {
        if (!ignore) {
          setCourses(res.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleComplete = async (courseId) => {
    try {
      await api.put(`/course/${courseId}/complete`);
      setCourses((prev) =>
        prev.map((course) =>
          course._id === courseId
            ? {
                ...course,
                progress: {
                  ...(course.progress || {}),
                  progressPercentage: 100,
                  completed: true,
                },
              }
            : course
        )
      );
    } catch (err) {
      console.log(err.response?.data || err);
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

                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <span>Progress</span>
                    <span>{course.progress?.progressPercentage || 0}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${course.progress?.progressPercentage || 0}%` }}
                    />
                  </div>
                </div>

                {course.progress?.completed ? (
                  <p className="mt-4 rounded-lg bg-green-500/10 px-3 py-2 text-sm text-green-400">
                    Completed
                  </p>
                ) : (
                  <button
                    onClick={() => handleComplete(course._id)}
                    className="mt-4 w-full rounded-lg bg-indigo-500 py-2 text-sm font-medium hover:bg-indigo-600"
                  >
                    Mark as Complete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
