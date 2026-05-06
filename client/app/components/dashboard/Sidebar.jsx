'use client'

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user] = useState(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const storedUser = localStorage.getItem("user");
    if (!storedUser || storedUser === "undefined") {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.log(error);
      return null;
    }
  });

  const isInstructor = user?.accountType === "Instructor";

  const menu = isInstructor
    ? [
        { name: "Dashboard", path: "/dashboard/instructor" },
        { name: "My Courses", path: "/dashboard/instructor/courses" },
        { name: "Add Course", path: "/dashboard/instructor/add-course" },
        { name: "Analytics", path: "/dashboard/instructor/analytics" },
        { name: "Profile", path: "/dashboard/student/profile" },
      ]
    : [
        { name: "Dashboard", path: "/dashboard/student" },
        { name: "My Courses", path: "/dashboard/student/courses" },
        { name: "Profile", path: "/dashboard/student/profile" },
      ];

  return (
    <div className="w-64 bg-white/5 border-r border-white/10 p-5 flex flex-col justify-between">
      <div className="mt-14">
        <h1 className="text-xl font-bold mb-8">EduDash</h1>

        <div className="space-y-2">
          {menu.map((item) => (
            <div
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`p-3 rounded-lg cursor-pointer transition ${
                pathname === item.path ? "bg-indigo-500" : "hover:bg-white/10"
              }`}
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => {
          localStorage.clear();
          router.push("/login");
        }}
        className="p-3 bg-red-500 rounded-lg"
      >
        Logout
      </button>
    </div>
  );
}
