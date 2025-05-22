"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Resolver, useForm } from "react-hook-form";
import { signinSchema, kidSchema } from "@/app/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { makeRequest } from "@/app/lib/helperFunctions";
import { useAuth } from "@/app/context/AuthContext";

type SigninFormValues = z.infer<typeof signinSchema>;
type KidFormValues = z.infer<typeof kidSchema>;

const SigninTemplate = ({ entity }: { entity: string }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<boolean>(false);
  const { login, user } = useAuth();

  const isKid = entity === "kid";

  const form = useForm<SigninFormValues | KidFormValues>({
    resolver: zodResolver(isKid ? kidSchema : (signinSchema as any)), // Use `as never` to resolve type mismatch
    defaultValues: (isKid
      ? { loginId: "" }
      : { email: "", password: "" }) as any, // Cast to `any` for now
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form as any;

  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to top when the component mounts
  }, []);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    console.log("Form Data:", {...data, entity, userId: user?.userId});
    const response = await makeRequest("/api/auth/signin", {
      method: "POST",
      body: JSON.stringify({...data, entity}),
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
      role: response.user.role,
      childName: response.user.childName,
      loginId: response.user.loginId
    });
    window.location.href = "/";
  };

  return (
    <div className="w-full flex-col lg:px-10 lg:py-5 mt-10">
      <div className="w-full flex flex-col">
        {!isKid && (
          <div className="w-full flex gap-5 justify-end items-center">
            <h1 className="text-gray-500 font-semibold">
              Don't have an account ?
            </h1>
            <Link
              href="signup"
              className="border-[rgb(90,191,249)] text-gray-500 text-base font-semibold border-2 py-1 px-4 rounded-full hover:bg-[rgb(73,186,250))] transition-all duration-300"
            >
              SIGN UP
            </Link>
          </div>
        )}
        <div className="w-full">
          <h1 className="text-1xl md:text-2xl lg:text-3xl font-bold text-gray-800 font-sans">
            Welcome back 😊
          </h1>
          <p className="text-slate-400 mt-2 text-base md:text-lg lg:text-lg">
            Let's make today Productive!!!
          </p>
        </div>
      </div>
      <form
        className="space-y-4  flex flex-col mt-10 gap-10"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Name */}
        {message && <p className="text-red-500">{message}</p>}
        {/* Email */}

        {isKid ? (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Login ID
            </label>
            <input
              type="text"
              placeholder="Enter Login ID"
              {...register("loginId")}
              className="mt-1 w-full lg:w-xl p-2 border-2 border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none focus:border-blue-200"
              onInput={() => setMessage(false)}
            />
            {errors.loginId && (
              <p className="text-red-500">{errors.loginId.message}</p>
            )}
          </div>
        ) : (
          // Regular User Login
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter email address"
                {...register("email")}
                className="mt-1 w-full lg:w-xl p-2 border-2 border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none focus:border-blue-200"
                onInput={() => setMessage(false)}
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                {...register("password")}
                className="mt-1 w-full lg:w-xl p-2 border-2 border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none focus:border-blue-200"
              />
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>
          </>
        )}

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
              "SIGNIN"
            )}
          </button>
        </div>
      </form>
      {/* <div className="w-full flex gap-5 items-center mt-15">
            <h1>Create account with</h1>
            <FaFacebook className="text-[rgb(90,191,249)]" size={20} />
            <FcGoogle size={20} />
          </div> */}
    </div>
  );
};

export default SigninTemplate;
