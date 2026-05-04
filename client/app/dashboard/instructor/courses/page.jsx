'use client'
import { useEffect, useState } from "react";
import api from "../../../services/api";
import { useRouter } from "next/navigation";

export default function InstructorCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter()

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

  // ✅ DELETE COURSE
  const handleDelete = async (courseId) => {
    const confirmDelete = confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    try {
      await api.delete("/course/delete", {
        data: { courseId },
      });

      // remove from UI instantly
      setCourses((prev) => prev.filter((c) => c._id !== courseId));

    } catch (err) {
      console.log(err.response?.data);
    }
  };

  // ✅ EDIT (basic version)
  const handleEdit = async (course) => {
    const newName = prompt("Enter new course name", course.courseName);
    if (!newName) return;

    try {
      await api.put("/course/update", {
        courseId: course._id,
        courseName: newName,
        courseDescription: course.courseDescription,
        price: course.price,
      });

      fetchCourses(); // refresh

    } catch (err) {
      console.log(err.response?.data);
    }
  };

  if (loading) {
    return <p className="text-white">Loading courses...</p>;
  }

  return (
    <div className="p-6 text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 mt-10">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <a
          href="/dashboard/instructor/add-course"
          className="bg-indigo-500 px-4 py-2 rounded-lg hover:bg-indigo-600"
        >
          + Add Course
        </a>
      </div>

      {/* EMPTY */}
      {courses.length === 0 ? (
        <div className="text-center mt-20 text-gray-400">
          <p>No courses created yet 😢</p>
        </div>
      ) : (

        <div className="grid md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:scale-[1.02] transition shadow-lg"
            >

              <img
                src={course.thumbnail}
                className="h-40 w-full object-cover"
              />

              <div className="p-4">

                <h2 className="font-semibold text-lg line-clamp-2">
                  {course.courseName}
                </h2>

                <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                  {course.courseDescription}
                </p>

                <p className="mt-3 font-semibold text-indigo-400">
                  ₹{course.price}
                </p>

                <p className="text-sm text-gray-400 mt-1">
                  👨‍🎓 {course.studentsEnrolled?.length || 0} Students
                </p>

                {/* ACTIONS */}
                <div className="flex gap-2 mt-4">

                  <button
  onClick={() => router.push(`/dashboard/instructor/edit-course/${course._id}`)}
  className="flex-1 bg-indigo-500 py-2 rounded-lg hover:bg-indigo-600"
>
  Edit
</button>

                  <button
                    onClick={() => handleDelete(course._id)}
                    className="flex-1 bg-red-500 py-2 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>

                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}