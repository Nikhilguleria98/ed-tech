export default function StudentDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6">

        <div className="p-6 bg-white/5 rounded-xl border">
          <h2 className="text-xl">Enrolled Courses</h2>
          <p className="text-3xl mt-2">5</p>
        </div>

        <div className="p-6 bg-white/5 rounded-xl border">
          <h2 className="text-xl">Completed</h2>
          <p className="text-3xl mt-2">2</p>
        </div>

        <div className="p-6 bg-white/5 rounded-xl border">
          <h2 className="text-xl">In Progress</h2>
          <p className="text-3xl mt-2">3</p>
        </div>

      </div>
    </div>
  );
}