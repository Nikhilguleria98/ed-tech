'use client';

import { useEffect, useState } from "react";
import api from "../../services/api";

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : null;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/course/all");

      // only instructor courses
      const myCourses = res.data.data.filter(
        (c) => c.instructor._id === user._id
      );

      setCourses(myCourses);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // 📊 STATS CALCULATION
  const totalCourses = courses.length;

  const totalStudents = courses.reduce((acc, course) => {
    return acc + (course.studentsEnrolled?.length || 0);
  }, 0);

  const totalRevenue = courses.reduce((acc, course) => {
    const students = course.studentsEnrolled?.length || 0;
    return acc + students * course.price;
  }, 0);

  if (loading) {
    return <p className="text-white">Loading dashboard...</p>;
  }

  return (
    <div className="text-white p-6 mt-10">

      <h1 className="text-3xl font-bold mb-6">
        Instructor Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        {/* COURSES */}
        <div className="p-6 bg-white/5 rounded-xl border border-white/10">
          <h2 className="text-gray-300">Total Courses</h2>
          <p className="text-3xl mt-2 font-bold text-indigo-400">
            {totalCourses}
          </p>
        </div>

        {/* STUDENTS */}
        <div className="p-6 bg-white/5 rounded-xl border border-white/10">
          <h2 className="text-gray-300">Total Students</h2>
          <p className="text-3xl mt-2 font-bold text-green-400">
            {totalStudents}
          </p>
        </div>

        {/* REVENUE */}
        <div className="p-6 bg-white/5 rounded-xl border border-white/10">
          <h2 className="text-gray-300">Revenue</h2>
          <p className="text-3xl mt-2 font-bold text-yellow-400">
            ₹{totalRevenue}
          </p>
        </div>

      </div>
    </div>
  );
}