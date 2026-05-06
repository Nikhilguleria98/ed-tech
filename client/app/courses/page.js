'use client';

import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { useRouter } from "next/navigation";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const router = useRouter();

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : null;

  useEffect(() => {
    let ignore = false;

    api.get("/course/all")
      .then((res) => {
        if (!ignore) {
          setCourses(res.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const filteredCourses = useMemo(() => {
    let temp = [...courses];

    if (search) {
      temp = temp.filter((course) =>
        course.courseName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filter === "low") {
      temp.sort((a, b) => a.price - b.price);
    } else if (filter === "high") {
      temp.sort((a, b) => b.price - a.price);
    }

    return temp;
  }, [courses, filter, search]);

  if (loading) return <p className="text-white text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 mt-20">
        <h1 className="text-3xl font-bold">Explore Courses</h1>

        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 outline-none w-full md:w-64"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-blue-500"
        >
          <option value="all">All</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
        </select>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div
              key={course._id}
              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden hover:scale-105 transition duration-300"
            >
              <img
                src={course.thumbnail}
                alt={course.courseName}
                className="h-40 w-full object-cover"
              />

              <div className="p-4">
                <h2 className="text-lg font-semibold">{course.courseName}</h2>

                <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                  {course.courseDescription}
                </p>

                <p className="mt-2 text-indigo-400 font-bold text-lg">
                  ₹{course.price}
                </p>

                {user?.accountType === "Instructor" ? (
                  <p className="mt-4 text-sm text-yellow-400">
                    Instructor cannot purchase
                  </p>
                ) : (
                  <button
                    onClick={() => router.push(`/courses/${course._id}`)}
                    className="w-full mt-4 bg-indigo-500 py-2 rounded-lg hover:bg-indigo-600 transition"
                  >
                    View Details
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-400">
            No courses found
          </p>
        )}
      </div>
    </div>
  );
}
