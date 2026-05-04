'use client'
import { useState } from "react";

const coursesData = {
  free: [
    {
      title: "Learn HTML",
      desc: "Basics of HTML, structure, text, links, images.",
    },
    {
      title: "Learn CSS",
      desc: "CSS styling, flexbox, animations and layouts.",
    },
    {
      title: "Responsive Design",
      desc: "Build responsive websites for all devices.",
    },
  ],
  new: [
    {
      title: "JavaScript Basics",
      desc: "Learn variables, functions, and DOM.",
    },
    {
      title: "Git & GitHub",
      desc: "Version control for beginners.",
    },
    {
      title: "Web Fundamentals",
      desc: "How the web works from scratch.",
    },
  ],
  popular: [
    {
      title: "React JS",
      desc: "Build modern UI with components.",
    },
    {
      title: "Node JS",
      desc: "Backend development with Express.",
    },
    {
      title: "MongoDB",
      desc: "NoSQL database basics.",
    },
  ],
  skills: [
    {
      title: "Frontend Path",
      desc: "HTML, CSS, JS → React",
    },
    {
      title: "Backend Path",
      desc: "Node, Express, DB",
    },
    {
      title: "Full Stack",
      desc: "Complete MERN roadmap",
    },
  ],
  career: [
    {
      title: "Web Developer",
      desc: "Become a full-stack dev",
    },
    {
      title: "UI Developer",
      desc: "Frontend focused career",
    },
    {
      title: "Software Engineer",
      desc: "Industry-ready skills",
    },
  ],
};

const tabs = [
  { id: "free", label: "Free" },
  { id: "new", label: "New to coding" },
  { id: "popular", label: "Most popular" },
  { id: "skills", label: "Skills paths" },
  { id: "career", label: "Career paths" },
];

const CourseSection = () => {
  const [activeTab, setActiveTab] = useState("free");

  return (
    <div className="bg-[#020617] text-white py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">

        {/* Heading */}
        <h2 className="text-3xl md:text-5xl font-bold">
          Unlock the <span className="text-cyan-400">Power of Code</span>
        </h2>
        <p className="text-gray-400 mt-3">
          Learn to Build Anything You Can Imagine
        </p>

        {/* Tabs */}
        <div className="flex flex-wrap justify-evenly gap-3 mt-8 bg-white/5 p-2 rounded-full backdrop-blur">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm md:text-base transition ${
                activeTab === tab.id
                  ? "bg-white text-black"
                  : "text-gray-300 hover:bg-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-12">
          {coursesData[activeTab].map((course, index) => (
            <div
              key={index}
              className="bg-[#0f172a] p-6 rounded-xl border border-white/10 hover:scale-105 transition"
            >
              <h3 className="text-xl font-semibold">{course.title}</h3>
              <p className="text-gray-400 mt-3">{course.desc}</p>

              <div className="border-t border-dashed border-gray-600 mt-6 pt-4 flex justify-between text-sm text-gray-400">
                <span>Beginner</span>
                <span>6 Lessons</span>
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <button className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300">
            Explore Full Catalog →
          </button>
          <button className="bg-white/10 border border-white/20 px-6 py-3 rounded-lg hover:bg-white/20">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseSection;