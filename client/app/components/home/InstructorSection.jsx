const InstructorSection = () => {
  return (
    <div className="bg-[#020617] text-white py-20 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT - IMAGE WITH EFFECT */}
        <div className="relative flex justify-center">

          {/* Glow Background */}
          <div className="absolute w-[300px] h-[300px] bg-cyan-500/20 blur-3xl rounded-full"></div>

          <img
            src="teacher2.png"
            alt="instructor"
            className="relative z-10 rounded-2xl shadow-2xl hover:scale-105 transition duration-500"
          />

          {/* Floating Card */}
          {/* <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-lg px-6 py-4 rounded-xl border border-white/20 flex gap-6">
            
            <div className="text-center">
              <p className="text-xl font-bold text-cyan-400">50K+</p>
              <p className="text-xs text-gray-300">Students</p>
            </div>

            <div className="border-l border-white/20"></div>

            <div className="text-center">
              <p className="text-xl font-bold text-cyan-400">$120K+</p>
              <p className="text-xs text-gray-300">Instructor Earnings</p>
            </div>

          </div> */}
        </div>

        {/* RIGHT - CONTENT */}
        <div>
          <h2 className="text-3xl md:text-5xl font-bold leading-tight">
            Turn Your Knowledge Into{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Income
            </span>
          </h2>

          <p className="mt-5 text-gray-400 text-lg">
            Share your expertise with a global audience. Create courses,
            inspire learners, and build a steady income stream — all in one platform.
          </p>

          {/* BULLET POINTS */}
          <div className="mt-6 space-y-3 text-gray-300">
            <p>✔ Create and publish courses </p>
            <p>✔ Reach students worldwide 🌍</p>
            <p>✔ Earn passive income 💰</p>
          </div>

          {/* CTA */}
          <button className="mt-8 bg-yellow-400 text-black px-7 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition flex items-center gap-2">
            Start Teaching Now →
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructorSection;