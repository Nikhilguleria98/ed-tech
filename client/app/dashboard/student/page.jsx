'use client'
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function StudentDashboard() {
  const [stats, setStats] = useState({
    enrolled: 0,
    completed: 0,
    inProgress: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    api.get("/student/dashboard")
      .then((res) => {
        if (!ignore) {
          setStats(res.data.data);
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

  if (loading) {
    return <p className="text-white">Loading dashboard...</p>;
  }

  return (
    <div className="p-6 text-white">

      <h1 className="text-3xl font-bold mb-8 mt-10">
        Student Dashboard 🎓
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        {/* ENROLLED */}
        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 shadow-lg hover:scale-[1.02] transition">
          <h2 className="text-gray-400">Enrolled Courses</h2>
          <p className="text-4xl font-bold mt-2 text-indigo-400">
            {stats.enrolled}
          </p>
        </div>

        {/* COMPLETED */}
        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 shadow-lg hover:scale-[1.02] transition">
          <h2 className="text-gray-400">Completed</h2>
          <p className="text-4xl font-bold mt-2 text-green-400">
            {stats.completed}
          </p>
        </div>

        {/* IN PROGRESS */}
        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 shadow-lg hover:scale-[1.02] transition">
          <h2 className="text-gray-400">In Progress</h2>
          <p className="text-4xl font-bold mt-2 text-yellow-400">
            {stats.inProgress}
          </p>
        </div>

      </div>
    </div>
  );
}
