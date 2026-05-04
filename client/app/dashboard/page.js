'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.accountType === "Instructor") {
      router.push("/dashboard/instructor");
    } else {
      router.push("/dashboard/student");
    }
  }, []);

  return null;
}