"use client";

import React, { useEffect, useState } from "react";
import SignImage from "@/public/signup.png";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { signinSchema } from "@/app/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { makeRequest } from "@/app/lib/helperFunctions";
import { useAuth } from "@/app/context/AuthContext";
import SigninTemplate from "@/app/components/signin/Signin";
type AuthFormValues = z.infer<typeof signinSchema>;
import TabComponent from "@/app/components/Tabs";
const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<boolean>(false);
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(signinSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to top when the component mounts
  }, []);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    console.log("Form Data:", data);
    const response = await makeRequest("/api/auth/signin", {
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
    window.location.href = "/";
  };
  const tabs = [
    {
      label: "Parent 💂",
      content: <SigninTemplate entity="parent"/>,
    },
    {
      label: "Kid 👶",
      content: <SigninTemplate entity="kid"/>,
    },
  ];

  return (
    <main className="w-full justify-between relative">
      <div className="flex flex-col lg:flex-row w-full h-full relative">
        <div className="bg-[rgb(250,248,253)] border-2 border-gray-100 w-full min-h-screen flex justify-center items-center">
          <Image src={SignImage} alt="sign" />
        </div>
        <TabComponent tabs={tabs} className="h-fit"/>
      </div>
    </main>
  );
};

export default Signin;
