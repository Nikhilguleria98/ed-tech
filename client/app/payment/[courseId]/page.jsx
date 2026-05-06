'use client';

import { useRouter, useParams } from "next/navigation";
import api from "../../services/api";
import { useState } from "react";

export default function PaymentPage() {
  const { courseId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    try {
      // simulate delay
      await new Promise((res) => setTimeout(res, 2000));

      // call backend
      await api.post("/course/purchase", { courseId });

      alert("✅ Payment Successful");

      router.push("/dashboard/student/courses");

    } catch (err) {
      console.log(err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">
      <div className="bg-white/5 p-8 rounded-2xl text-center w-[400px]">

        <h1 className="text-2xl font-bold mb-4">Complete Payment</h1>

        <p className="text-gray-400 mb-6">
          This is a dummy payment page
        </p>

        <button
          onClick={handlePayment}
          disabled={loading}
          className={`w-full py-3 rounded-lg ${
            loading ? "bg-gray-500" : "bg-indigo-500"
          }`}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>

      </div>
    </div>
  );
}