"use client";

import { useEffect, useState } from "react";
import Logo from "@/public/logo.png";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { makeRequest } from "@/app/lib/helperFunctions";
import { useAuth } from "@/app/context/AuthContext";
const VerifyEmail = () => {
  const [message, setMessage] = useState("Verifying...");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { updateUser } = useAuth();

  useEffect(() => {
    if (!token) {
      setMessage("Invalid verification link.");
      return;
    }

    // Simulate API call or verify token
    (async () => {
      const response = await makeRequest(
        `/api/auth/verify-email?token=${token}`,
        { method: "GET" }
      );

      if (!response.success) setMessage(response.message);

      setMessage("Email verification successful.");
      updateUser({ isVerified: true });
    })();
  }, []);

  return (
    <main className="flex-col flex justify-center items-center w-full py-20 gap-20 mb-auto">
      <div>
        <Image src={Logo} alt="image" width={150} />
      </div>
      <div className="text-center py-5 px-12 bg-[rgb(90,191,249)]">
        <h2 className="text-2xl text-slate-50">{message}</h2>
      </div>
    </main>
  );
};

export default VerifyEmail;
