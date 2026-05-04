const HeroSection = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 items-center gap-10">
        
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Learn Skills That Shape Your Future 🚀
          </h1>
          <p className="mt-4 text-lg text-gray-200">
            Join thousands of learners and master in-demand skills with top instructors.
          </p>

          <div className="mt-6 flex gap-4">
            <button className="bg-white text-blue-600 px-6 py-3 rounded font-semibold">
              Explore Courses
            </button>
            <button className="border border-white px-6 py-3 rounded">
              Become Instructor
            </button>
          </div>
        </div>

        <img
          src="https://imgs.search.brave.com/dj91cach-s8oA4soLiySiRlK4b7FPCKde97Zm5XH1is/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNjkv/NzAwLzU0NC9zbWFs/bC9vcGVuLWJvb2st/d2l0aC1nbG93aW5n/LWxpZ2h0YnVsYi1h/bmQtZ3JhZHVhdGlv/bi1jYXAtc3ltYm9s/aXppbmctZWR1Y2F0/aW9uLWFuZC1pZGVh/cy1mcmVlLXBob3Rv/LmpwZw"
          className="rounded-xl shadow-lg"
        />
      </div>
    </div>
  );
};

export default HeroSection;