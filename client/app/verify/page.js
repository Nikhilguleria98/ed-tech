'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../services/api";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const router = useRouter();

  const handleVerify = async () => {
    try {
      const data = JSON.parse(localStorage.getItem("signupData"));

      await api.post("/signup", {
        ...data,
        otp,
      });

      localStorage.removeItem("signupData");

      alert("Account created ✅");
      router.push("/login");

    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] px-4">
      <div className="w-full max-w-md rounded-3xl p-10 bg-white/5 border border-white/10 text-white text-center">

        <h2 className="text-2xl mb-6">Verify OTP</h2>

        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full p-3 rounded bg-white/10 border border-gray-700 text-center tracking-widest"
        />

        <button
          onClick={handleVerify}
          className="w-full mt-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg"
        >
          Verify & Continue
        </button>
      </div>
    </div>
  );
}