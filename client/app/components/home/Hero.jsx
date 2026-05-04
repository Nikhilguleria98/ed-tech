const HeroSection = () => {
  return (
    <div className="relative h-screen w-full flex items-center justify-center text-white">

      {/* Background Image */}
      <img
        src="coding bg2.jpg"
        alt="hero"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/80 "></div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl px-6">

        {/* Top Button */}
        <button className="mb-6 px-5 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/20 transition">
          Become an Instructor →
        </button>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Empower Your Future with{" "}
          <span className="text-cyan-400">Coding Skills</span>
        </h1>

        {/* Description */}
        <p className="mt-6 text-gray-300 text-lg">
          Learn at your own pace from anywhere with hands-on projects,
          quizzes, and expert guidance.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <button className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition">
            Learn More
          </button>
          <button className="bg-white/10 border border-white/20 px-6 py-3 rounded-lg backdrop-blur-md hover:bg-white/20 transition">
            Book a Demo
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;