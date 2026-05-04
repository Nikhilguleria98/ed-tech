"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../slices/authSlice";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const pathname = usePathname();

  const navLink = (path) =>
    `px-4 py-2 rounded-lg transition ${
      pathname === path
        ? "bg-white/20 text-white"
        : "text-white/80 hover:bg-white/10"
    }`;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-white/10 border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-white">
          EdTech
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/" className={navLink("/")}>
            Home
          </Link>

          <Link href="/courses" className={navLink("/courses")}>
            Courses
          </Link>

          <Link href="/dashboard" className={navLink("/dashboard")}>
            Dashboard
          </Link>
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-4">
          {!token ? (
            <>
              <Link href="/login" className="text-white/80 hover:text-white">
                Login
              </Link>

              <Link
                href="/signup"
                className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg text-white hover:bg-white/30"
              >
                Signup
              </Link>
            </>
          ) : (
            <button
              onClick={() => dispatch(logout())}
              className="bg-red-500/80 px-4 py-2 rounded-lg text-white hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setOpen(!open)}
            className="text-white text-2xl"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white/10 backdrop-blur-lg px-6 pb-4 flex flex-col gap-3">
          <Link href="/" className={navLink("/")}>
            Home
          </Link>
          <Link href="/courses" className={navLink("/courses")}>
            Courses
          </Link>
          <Link href="/dashboard" className={navLink("/dashboard")}>
            Dashboard
          </Link>

          {!token ? (
            <>
              <Link href="/login" className="text-white">
                Login
              </Link>
              <Link href="/signup" className="text-white">
                Signup
              </Link>
            </>
          ) : (
            <button
              onClick={() => dispatch(logout())}
              className="text-red-400"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;