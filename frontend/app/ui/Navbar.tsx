"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/logo.png";
import { useAuth } from "../context/AuthContext";
import { usePathname } from "next/navigation";
import { makeRequest } from "../lib/helperFunctions";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import Modal from "../components/Modal";
import KidsSubLinks from "@/app/components/KidsSubLinks";
import { useSelector, useDispatch } from "react-redux";
import { setActiveTab } from "../redux/slices/uiSlice";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubLink, setOpenSubLink] = useState(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const dispatch = useDispatch();
  const activeTab = useSelector((state: any) => state.ui.activeTab);

  const handleLogout = async () => {
    setModalOpen(true);
    const response = await makeRequest("/api/auth/logout", { method: "POST" });

    const { success } = response;

    if (!success) return;

    logout();
    window.location.href = "/";
  };

  const toggleActiveTab = useCallback(() => {
    dispatch(setActiveTab("/"));
  }, []);

  // const handleOpenModal = useCallback(() => {
  //   if (user && user.role === "parent" && !user?.isVerified) {
  //     setModalOpen(true);
  //   }
  // }, [isOpen]);
  // useEffect(() => {
  //   handleOpenModal();
  // }, [handleOpenModal]);

  useEffect(() => {
    toggleActiveTab();
  }, []);
  return (
    <nav
      className={`bg-white text-white border-b-gray-300 border-b-1 ${
        pathname === "/verify-email" ||
        pathname === "/signup" ||
        pathname === "/signin"
          ? "hidden"
          : "block"
      } relative z-20`}
    >
      <Modal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        onClose={() => {}}
      >
        <div className="flex flex-col gap-10 items-center justify-center">
          <p className="font-semibold font-sans text-lg">Sad to see you go</p>
          <span className="loading loading-ring loading-lg text-violet-500"></span>
        </div>
      </Modal>
      <div className="container mx-auto flex justify-between items-center px-6 py-4 relative">
        {/* Logo */}
        <div className="flex flex-row gap-3 items-center">
          <Image src={Logo} alt="logo" width={50} />
          <Link
            href="/"
            className={`text-xl font-bold tracking-wide text-gray-500 hover:text-[rgb(80,186,248)] transition duration-300`}
          >
            KidsBank
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 relative items-center">
          <Link
            href="/"
            className={`hover:text-[rgb(80,186,248)] transition duration-300 text-gray-500 ${
              activeTab === "/"
                ? "btn btn-sm bg-blue-500 text-white font-bold"
                : ""
            }`}
            onClick={() => dispatch(setActiveTab("/"))}
          >
            Home
          </Link>

          {/* Kids Dropdown (Hover Effect Fixed) */}
          <div className="relative group">
            {user && (
              <button className="flex items-center hover:text-[rgb(80,186,248)] transition duration-300 text-gray-500 cursor-pointer">
                Kids <MdOutlineKeyboardArrowDown />
              </button>
            )}

            <div
              className={`absolute right-[-10] mt-1 ${
                user && user.role === "parent" ? "w-96" : "w-48"
              }  bg-white text-black shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto`}
            >
              <div className="flex flex-row  justify-between">
                <KidsSubLinks isOpen={isOpen} role={user! && user?.role} />
              </div>
            </div>
          </div>

          <Link
            href="contact"
            onClick={() => dispatch(setActiveTab("/contact"))}
            className={`hover:text-[rgb(80,186,248)] transition duration-300 text-gray-500 ${
              activeTab === "/contact"
                ? "btn btn-sm bg-blue-500 text-white font-bold"
                : ""
            }`}
          >
            Contact
          </Link>
        </div>
        {!user ? (
          <div className="flex gap-3 items-center">
            <Link
              href="signin"
              className="text-gray-500 hover:text-[rgb(80,186,248)] transition duration-300"
            >
              Login
            </Link>
            <Link
              href="signup"
              className="text-slate-50 btn bg-[rgb(80,186,248)] hover:bg-[rgb(82,161,206)] transition duration-300"
            >
              Sign Up
            </Link>
          </div>
        ) : (
          <div className="flex gap-3 items-center">
            <Link
              href="/user/user-profile"
              onClick={() => dispatch(setActiveTab("/user/user-profile"))}
              className="text-gray-500 hover:text-[rgb(80,186,248)] transition duration-300 hidden md:inline"
            >
              {user.username || user.childName}
            </Link>

            <button
              className="text-red-400 btn bg-[rgb(80,186,248)] hover:bg-[rgb(82,161,206)] transition duration-300 hover:scale-110"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl text-gray-500 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "✖" : "≡"} {/* ✖ (Close) | ≡ (Menu) */}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[rgb(80,186,248)] text-white py-4 space-y-2">
          <Link href="/" className="block text-center py-2 hover:bg-blue-500">
            Home
          </Link>

          {/* Kids Dropdown in Mobile */}
          <div className="text-center">
            {user && (
              <button
                className="flex justify-center w-full py-2 hover:bg-[rgb(80,186,248)] items-center cursor-pointer"
                onClick={() => setOpenSubLink(!openSubLink)}
              >
                Kids <MdOutlineKeyboardArrowDown />
              </button>
            )}
            <div
              className={`bg-[rgb(27,139,204)] overflow-hidden transition-all duration-300 ${
                openSubLink
                  ? "max-h-40 opacity-100"
                  : "max-h-0 opacity-0 overflow-y-scroll"
              }`}
            >
              <div className="flex flex-row justify-between">
                <KidsSubLinks isOpen={isOpen} role={user! && user?.role} />
              </div>
            </div>
          </div>

          {/* )} */}

          <Link
            href="/contact"
            className="block text-center py-2 hover:bg-[rgb(80,186,248)]"
          >
            Contact
          </Link>
          {user && (
            <Link
              href="/user/user-profile"
              onClick={() => dispatch(setActiveTab("/user/user-profile"))}
              className="block text-center py-2 hover:bg-[rgb(80,186,248)]"
            >
              {user.username || user.childName}
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
