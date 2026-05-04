import { FaBrain, FaRocket, FaUsers, FaCode } from "react-icons/fa";

const features = [
  {
    icon: <FaBrain />,
    title: "Smart Learning",
    desc: "AI-driven paths that adapt to your pace and goals.",
  },
  {
    icon: <FaRocket />,
    title: "Fast Growth",
    desc: "Learn practical skills that get you job-ready faster.",
  },
  {
    icon: <FaUsers />,
    title: "Community Support",
    desc: "Collaborate, share, and grow with other learners.",
  },
  {
    icon: <FaCode />,
    title: "Real Projects",
    desc: "Build real-world applications, not just theory.",
  },
];

const SkillsSection = () => {
  return (
    <div className="bg-[#f8fafc] py-20 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT CONTENT */}
        <div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
            Build Skills That Actually{" "}
            <span className="text-cyan-500">Pay Off</span>
          </h2>

          <p className="mt-5 text-gray-600 text-lg">
            Stop wasting time on outdated tutorials. Learn modern tech skills
            that companies are actively hiring for — with hands-on experience.
          </p>

          {/* FEATURES */}
          <div className="mt-8 space-y-6">
            {features.map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                
                <div className="bg-cyan-100 text-cyan-600 p-3 rounded-full text-lg">
                  {item.icon}
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800">
                    {item.title}
                  </h4>
                  <p className="text-gray-500 text-sm">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* BUTTON */}
          <button className="mt-8 bg-yellow-400 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition">
            Start Learning →
          </button>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative flex justify-center">
          
          <img
            src="teacher2.png" 
            alt="learning"
            className="w-[90%] md:w-full"
          />

          {/* STATS CARD */}
          <div className="absolute bottom-0 translate-y-1/2 bg-emerald-700 text-white px-6 py-4 rounded-2xl shadow-lg flex gap-8">
            
            <div className="text-center">
              <p className="text-2xl font-bold">12+</p>
              <p className="text-xs text-gray-200">Years Experience</p>
            </div>

            <div className="border-l border-white/30"></div>

            <div className="text-center">
              <p className="text-2xl font-bold">500+</p>
              <p className="text-xs text-gray-200">Courses Available</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsSection;