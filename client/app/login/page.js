'use client'
import React, { useState } from "react";
import api from "../services/api";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await api.post("/login", data);

    // ✅ STORE BOTH
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    router.push("/dashboard");

  } catch (err) {
    alert(err.response?.data?.message);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] px-4">
      <div className="w-full max-w-md rounded-3xl p-10 bg-white/5 border border-white/10 text-white">

        <h2 className="text-2xl mb-6">Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">

          <FloatingInput name="email" label="Email Address" onChange={handleChange}/>
          <FloatingInput name="password" type="password" label="Password" onChange={handleChange}/>

          <button className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

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