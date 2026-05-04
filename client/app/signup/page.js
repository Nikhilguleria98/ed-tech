'use client'
import React, { useState } from "react";
import api from "../services/api";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();

  const [role, setRole] = useState("learner");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();

    try {
      await api.post("/send-otp", { email: formData.email });

      localStorage.setItem("signupData", JSON.stringify({
        ...formData,
        accountType: role === "mentor" ? "Instructor" : "Student",
      }));

      router.push("/verify");

    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] px-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 mt-20">

        {/* LEFT PANEL */}
        <div className="hidden md:flex flex-col justify-center p-10 text-white bg-gradient-to-br from-indigo-600/20 to-purple-600/20">
          <h1 className="text-4xl font-bold">Start your journey 🚀</h1>

          <div className="mt-6 flex gap-3">
            {["learner", "mentor"].map((item) => (
              <button
                key={item}
                onClick={() => setRole(item)}
                className={`px-5 py-2 rounded-full ${
                  role === item
                    ? "bg-white text-black scale-105"
                    : "bg-white/10"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="p-6 md:p-10 text-white">
          <h2 className="text-2xl mb-6">Signup</h2>

          <form onSubmit={handleSendOTP} className="space-y-4">

            <FloatingInput name="firstName" label="First Name" onChange={handleChange}/>
            <FloatingInput name="lastName" label="Last Name" onChange={handleChange}/>
            <FloatingInput name="email" label="Email Address" onChange={handleChange}/>
            <FloatingInput name="password" type="password" label="Password" onChange={handleChange}/>
            <FloatingInput name="confirmPassword" type="password" label="Confirm Password" onChange={handleChange}/>

            <button className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500">
              Send OTP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// 🔁 SAME INPUT UI
const FloatingInput = ({ label, name, onChange, type = "text" }) => (
  <div className="relative">
    <input
      type={type}
      name={name}
      onChange={onChange}
      placeholder=" "
      className="peer w-full px-4 pt-5 pb-2 rounded-lg bg-white/5 border border-gray-700 focus:border-indigo-500 outline-none"
    />
    <label className="absolute left-4 top-2 text-sm text-gray-400 
      peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base 
      transition-all peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-400">
      {label}
    </label>
  </div>
);