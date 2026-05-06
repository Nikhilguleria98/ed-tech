'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "../../services/api";

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : null;

  useEffect(() => {
    fetchCourse();
  }, []);

  const fetchCourse = async () => {
    try {
      const res = await api.get(`/course/${id}`);
      setCourse(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleBuy = async () => {
    try {
      await api.post("/purchase", { courseId: id });
      alert("Course purchased successfully 🎉");
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  if (!course) {
    return <p className="text-white text-center mt-20">Loading...</p>;
  }

  return (
    <div className="bg-[#0f172a] text-white min-h-screen">

      {/* HERO */}
      <div className="relative h-[300px]">
        <img
          src={course.thumbnail}
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent" />

        <div className="absolute bottom-6 left-6 max-w-3xl">
          <h1 className="text-4xl font-bold">{course.courseName}</h1>
          <p className="text-gray-300 mt-2">
            {course.courseDescription}
          </p>

          <div className="flex gap-4 mt-3 text-sm text-gray-400">
            <span>⭐ 4.5</span>
            <span>👨‍🎓 1200 students</span>
            <span>👨‍🏫 {course.instructor?.name || "Instructor"}</span>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-10 px-6 py-10">

        {/* LEFT CONTENT */}
        <div className="lg:col-span-2">

          {/* GALLERY */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <img src={course.thumbnail} className="rounded-lg h-28 object-cover" />
            <img src={course.thumbnail} className="rounded-lg h-28 object-cover" />
            <img src={course.thumbnail} className="rounded-lg h-28 object-cover" />
          </div>

          {/* TABS */}
          <div className="flex gap-6 border-b border-gray-700 mb-6">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-2 ${activeTab === "overview" ? "border-b-2 border-indigo-500 text-indigo-400" : ""}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("curriculum")}
              className={`pb-2 ${activeTab === "curriculum" ? "border-b-2 border-indigo-500 text-indigo-400" : ""}`}
            >
              Curriculum
            </button>
          </div>

          {/* TAB CONTENT */}
          {activeTab === "overview" && (
            <div>
              <h2 className="text-xl font-semibold mb-3">What you'll learn</h2>
              <ul className="grid md:grid-cols-2 gap-3 text-gray-300">
                <li>✔ Build real-world projects</li>
                <li>✔ Master core concepts</li>
                <li>✔ Industry practices</li>
                <li>✔ Interview preparation</li>
              </ul>
            </div>
          )}

          {activeTab === "curriculum" && (
            <div>
              <h2 className="text-xl font-semibold mb-3">Course Content</h2>
              <div className="space-y-3">
                <div className="bg-white/5 p-4 rounded-lg">
                  <p>📘 Introduction to Course</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <p>📘 Core Concepts</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <p>📘 Final Project</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDE (STICKY CARD) */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl h-fit sticky top-24">

          <img
            src={course.thumbnail}
            className="rounded-lg mb-4"
          />

          <p className="text-3xl font-bold text-indigo-400 mb-4">
            ₹{course.price}
          </p>

          {user?.accountType === "Instructor" ? (
            <p className="text-yellow-400">
              Instructors cannot purchase
            </p>
          ) : (
            <button
              onClick={handleBuy}
              className="w-full bg-indigo-500 py-3 rounded-lg hover:bg-indigo-600"
            >
              Buy Now
            </button>
          )}

          <div className="mt-4 text-sm text-gray-400 space-y-2">
            <p>✔ Full lifetime access</p>
            <p>✔ Access on mobile & TV</p>
            <p>✔ Certificate of completion</p>
          </div>
        </div>

      </div>
    </div>
  );
}