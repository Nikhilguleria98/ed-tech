'use client';

import { useRouter, useParams } from "next/navigation";
import api from "../../services/api";
import { useState } from "react";

export default function PaymentPage() {
  const { courseId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const handlePayment = async () => {
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      await api.post("/course/purchase", { courseId, paymentMethod });
      alert("Payment successful");
      router.push("/dashboard/student/courses");
    } catch (err) {
      alert(err.response?.data?.message || "Payment failed");
      console.log(err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <p className="mt-1 text-sm text-gray-400">
          Dummy payment mode for local testing
        </p>

        <div className="mt-6 space-y-3">
          {[
            ["card", "Test Card", "4242 4242 4242 4242"],
            ["upi", "Test UPI", "student@upi"],
            ["wallet", "Test Wallet", "Instant approval"],
          ].map(([value, label, detail]) => (
            <button
              key={value}
              onClick={() => setPaymentMethod(value)}
              className={`w-full rounded-xl border p-4 text-left transition ${
                paymentMethod === value
                  ? "border-indigo-400 bg-indigo-500/20"
                  : "border-white/10 bg-black/20 hover:bg-white/10"
              }`}
            >
              <span className="block font-medium">{label}</span>
              <span className="text-sm text-gray-400">{detail}</span>
            </button>
          ))}
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className={`mt-6 w-full rounded-lg py-3 font-medium ${
            loading ? "bg-gray-500" : "bg-indigo-500 hover:bg-indigo-600"
          }`}
        >
          {loading ? "Processing Payment..." : "Pay and Enroll"}
        </button>
      </div>
    </div>
  );
}
