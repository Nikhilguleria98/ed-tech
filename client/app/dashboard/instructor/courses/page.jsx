'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../services/api";

export default function InstructorCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let ignore = false;

    const loadCourses = async () => {
      try {
        const res = await api.get("/course/instructor-dashboard", {
          headers: { "Cache-Control": "no-cache" },
          params: { t: Date.now() },
        });
        if (!ignore) {
          setCourses(res.data.data.courses);
        }
      } catch (err) {
        console.log(err.response?.data);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    const handleFocus = () => {
      loadCourses();
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadCourses();
      }
    };
    const intervalId = window.setInterval(loadCourses, 5000);

    loadCourses();
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      ignore = true;
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleDelete = async (courseId) => {
    if (!confirm("Delete this course?")) return;

    try {
      await api.delete(`/course/${courseId}`);
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (courseId) => {
    router.push(`/dashboard/instructor/edit-course/${courseId}`);
  };

  const totalStudents = courses.reduce(
    (total, course) => total + (course.enrollmentCount || course.studentsEnrolled?.length || 0),
    0
  );
  const totalRevenue = courses.reduce(
    (total, course) => total + (course.revenue ?? (course.studentsEnrolled?.length || 0) * course.price),
    0
  );

  if (loading) return <p className="text-white">Loading...</p>;

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between mb-8 mt-10">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <a href="/dashboard/instructor/add-course" className="bg-indigo-500 px-4 py-2 rounded-lg">
          + Add Course
        </a>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-sm text-gray-400">Published Courses</p>
          <p className="text-3xl font-bold text-indigo-400 mt-1">{courses.length}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-sm text-gray-400">Purchased Enrollments</p>
          <p className="text-3xl font-bold text-green-400 mt-1">{totalStudents}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-sm text-gray-400">Revenue</p>
          <p className="text-3xl font-bold text-yellow-400 mt-1">₹{totalRevenue}</p>
        </div>
      </div>

      {courses.length === 0 ? (
        <p className="text-center text-gray-400 mt-20">No courses yet</p>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map((c) => (
            <div key={c._id} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <img src={c.thumbnail} alt={c.courseName} className="h-40 w-full rounded-lg object-cover" />

              <h2 className="mt-3 font-semibold">{c.courseName}</h2>
              <p className="text-indigo-400">₹{c.price}</p>

              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-black/20 p-3">
                  <p className="text-gray-400">Students</p>
                  <p className="text-lg font-semibold">{c.enrollmentCount || c.studentsEnrolled?.length || 0}</p>
                </div>
                <div className="rounded-lg bg-black/20 p-3">
                  <p className="text-gray-400">Revenue</p>
                  <p className="text-lg font-semibold">₹{c.revenue ?? (c.studentsEnrolled?.length || 0) * c.price}</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="mb-2 text-sm font-medium text-gray-300">Purchased by</p>
                {c.studentsEnrolled?.length ? (
                  <div className="max-h-32 space-y-2 overflow-y-auto pr-1">
                    {c.studentsEnrolled.map((student) => (
                      <div key={student._id} className="rounded-lg bg-black/20 px-3 py-2">
                        <p className="text-sm font-medium">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-xs text-gray-400">{student.email}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-lg bg-black/20 px-3 py-2 text-sm text-gray-400">
                    No purchases yet
                  </p>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <button onClick={() => handleEdit(c._id)} className="bg-indigo-500 px-3 py-1 rounded">
                  Edit
                </button>

                <button onClick={() => handleDelete(c._id)} className="bg-red-500 px-3 py-1 rounded">
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
