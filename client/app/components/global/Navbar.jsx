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
    `px-4 py-2 transition ${
      pathname === path
        ? "border-b-2 text-[#53CBF3] font-semibold"
        : "font-semibold text-gray-600 hover:text-[#53CBF3]"
    }`;

  return (
    <nav className=" fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-white/10 border-b border-white/20 shadow-lg">
      <div className="responsivewidth mx-auto  py-3 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-[#53CBF3]">
          Lumina Premiere
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/" className={navLink("/")}>
            Courses
          </Link>

          <Link href="/courses" className={navLink("/courses")}>
            Experience
          </Link>

          <Link href="/dashboard" className={navLink("/dashboard")}>
            Instructor
          </Link>
          <Link href="/dashboard" className={navLink("/dashboard")}>
            Pricing
          </Link>
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-4">
          {!token ? (
            <>
              <Link href="/login" className=" hover:text-white text-[#53CBF3]">
                Login
              </Link>

              <Link
                href="/signup"
                className="bg-[#53CBF3] backdrop-blur-md px-4 py-2 rounded-lg  hover:bg-[#53CBF3]"
              >
                Signup
              </Link>
            </>
          ) : (
            <button
              onClick={() => dispatch(logout())}
              className="bg-red-500/80 px-4 py-2 rounded-lg text-black hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setOpen(!open)}
            className="text-black text-2xl"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white/10 backdrop-blur-lg  pb-4 flex flex-col ">
         <div className="mt-2 flex flex-col">
           <Link href="/" className={navLink("/")}>
            Courses
          </Link>
          <Link href="/courses" className={navLink("/courses")}>
            Experience
          </Link>
          <Link href="/dashboard" className={navLink("/dashboard")}>
            Instructor
          </Link>
          <Link href="/dashboard" className={navLink("/dashboard")}>
            Pricing
          </Link>
         </div>

          {!token ? (
            <div className="flex flex-col items-center justify-center gap-4">
              <Link href="/login" className="text-black bg-[#53CBF3] p-3">
                Login
              </Link>
              <Link href="/signup" className="text-black bg-[#53CBF3] p-3">
                Signup
              </Link>
            </div>
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