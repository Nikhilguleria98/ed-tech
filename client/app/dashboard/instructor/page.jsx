'use client'

import { useEffect, useState } from "react";
import api from "../../services/api";

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
  });
  const [recentPurchases, setRecentPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const loadDashboard = async () => {
      try {
        const res = await api.get("/course/instructor-dashboard", {
          headers: { "Cache-Control": "no-cache" },
          params: { t: Date.now() },
        });

        if (!ignore) {
          setCourses(res.data.data.courses);
          setStats(res.data.data.stats);
          setRecentPurchases(res.data.data.recentPurchases);
        }
      } catch (err) {
        console.log(err.response?.data || err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    const handleFocus = () => {
      loadDashboard();
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadDashboard();
      }
    };
    const intervalId = window.setInterval(loadDashboard, 5000);

    loadDashboard();
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      ignore = true;
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  if (loading) {
    return <p className="text-white">Loading dashboard...</p>;
  }

  return (
    <div className="text-white p-6 mt-10">
      <h1 className="text-3xl font-bold mb-6">Instructor Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 bg-white/5 rounded-xl border border-white/10">
          <h2 className="text-gray-300">Total Courses</h2>
          <p className="text-3xl mt-2 font-bold text-indigo-400">{stats.totalCourses}</p>
        </div>

        <div className="p-6 bg-white/5 rounded-xl border border-white/10">
          <h2 className="text-gray-300">Total Students</h2>
          <p className="text-3xl mt-2 font-bold text-green-400">{stats.totalStudents}</p>
        </div>

        <div className="p-6 bg-white/5 rounded-xl border border-white/10">
          <h2 className="text-gray-300">Revenue</h2>
          <p className="text-3xl mt-2 font-bold text-yellow-400">₹{stats.totalRevenue}</p>
        </div>
      </div>

      <div className="mt-8 grid lg:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h2 className="text-xl font-semibold mb-4">Course Performance</h2>
          <div className="space-y-3">
            {courses.length ? courses.map((course) => (
              <div key={course._id} className="rounded-lg bg-black/20 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{course.courseName}</p>
                  <p className="text-sm text-yellow-400">₹{course.revenue}</p>
                </div>
                <p className="text-sm text-gray-400">
                  {course.enrollmentCount || 0} students purchased
                </p>
              </div>
            )) : (
              <p className="text-gray-400">No courses published yet</p>
            )}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h2 className="text-xl font-semibold mb-4">Recent Purchases</h2>
          <div className="space-y-3">
            {recentPurchases.length ? recentPurchases.map((purchase) => (
              <div key={`${purchase.courseId}-${purchase.student._id}`} className="rounded-lg bg-black/20 p-3">
                <p className="font-medium">
                  {purchase.student.firstName} {purchase.student.lastName}
                </p>
                <p className="text-sm text-gray-400">{purchase.student.email}</p>
                <p className="mt-1 text-sm text-indigo-300">
                  {purchase.courseName} • ₹{purchase.price}
                </p>
              </div>
            )) : (
              <p className="text-gray-400">No purchases yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
