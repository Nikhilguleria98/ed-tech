'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser && storedUser !== "undefined"
      ? JSON.parse(storedUser)
      : null;

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
