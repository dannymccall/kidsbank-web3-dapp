"use client";

import React, { useEffect, useState } from "react";
import SignImage from "@/public/signup.png";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { authSchema } from "@/app/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { makeRequest } from "@/app/lib/helperFunctions";
import { useAuth } from "@/app/context/AuthContext";
type AuthFormValues = z.infer<typeof authSchema>;

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<boolean>(false);
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: { username: "", email: "", password: "" },
  });

  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to top when the component mounts
  }, []);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    console.log("Form Data:", data);
    const response = await makeRequest("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.success) {
      setMessage(response.message);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    login({
      username: response.user.username,
      password: response.user.password,
      email: response.user.email,
      isVerified: response.user.emailVerified,
      userId: response.user._id,
      role: response.user.role
    });
    window.location.href = "/"
  };

  return (
    <main className="w-full justify-between relative">
      <div className="flex flex-col lg:flex-row w-full h-full relative">
        <div className="bg-[rgb(250,248,253)] border-2 border-gray-100 w-full min-h-screen flex justify-center items-center">
          <Image src={SignImage} alt="sign" />
        </div>
        <div className="w-full flex-col px-10 py-5 mt-24">
          <div className="w-full flex flex-col">
            <div className="w-full flex gap-5 justify-end items-center">
              <h1 className="text-gray-500 font-semibold">
                Already have an account ?
              </h1>
              <Link
                href="signin"
                className="border-[rgb(90,191,249)] text-gray-500 text-base font-semibold border-2 py-1 px-4 rounded-full hover:bg-[rgb(73,186,250))] transition-all duration-300"
              >
                SIGN IN
              </Link>
            </div>
            <div className="w-full">
              <h1 className="text-1xl md:text-2xl lg:text-3xl font-bold text-gray-800 font-sans">
                Welcome to KidsBank!
              </h1>
              <p className="text-slate-400 mt-2 text-base md:text-lg lg:text-lg">
                Register your account
              </p>
            </div>
          </div>
          <form
            className="space-y-4  flex flex-col mt-10 gap-10"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Name */}
            {message && <p className="text-red-500">{message}</p>}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                {...register("username", { required: "Username is required" })}
                className="mt-1 w-full lg:w-xl p-2 border-2 border-gray-300 rounded-lg focus:outline-none  focus:border-blue-200 focus:ring focus:ring-blue-200"
                onInput={() => setMessage(false)}
              />
              {errors.username && (
                <p className="text-red-500">{errors.username.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                {...register("email", { required: "Email is required" })}
                className="mt-1 w-full lg:w-xl p-2 border-2 border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none  focus:border-blue-200"
                onInput={() => setMessage(false)}
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Message */}
            <div className="relative w-full">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="flex w-full lg:w-xl border-2 border-gray-300 rounded-lg focus-within::ring focus-within:ring-blue-200 focus:outline-none  focus-within:border-blue-200 items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  className="mt-1 w-full lg:w-xl p-2 focus:outline-none"
                  placeholder="Enter password"
                  {...register("password", { required: "Password Required" })}
                />
                <span
                  className=" right-4 cursor-pointer text-gray-500 p-2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash size={22} />
                  ) : (
                    <FaEye size={22} />
                  )}
                </span>
              </div>
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="">
              <button
                type="submit"
                className="bg-[rgb(90,191,249)] text-white py-2 px-6 rounded-lg hover:bg-blue-700  cursor-pointer transition-all duration-300 disabled:bg-gray-400"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-spinner text-neutral"></span>
                ) : (
                  "Create account"
                )}
              </button>
            </div>
          </form>
          <div className="w-full flex gap-5 items-center mt-15">
            <h1>Create account with</h1>
            <FaFacebook className="text-[rgb(90,191,249)]" size={20} />
            <FcGoogle size={20} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Signup;
