import { useEffect, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema } from "../lib/definitions";
import { makeRequest } from "../lib/helperFunctions";
import { FaRegCircleCheck } from "react-icons/fa6";

import { z } from "zod";
import { error } from "console";
import Toast from "./Toast";
export function ChangePassword({ username }: { username: string }) {
  const [message, setMessage] = useState<{
    type?: string;
    message?: string;
    showMessage?: boolean;
  }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    console.log({ ...data, username });
    const response = await makeRequest("/api/auth/user?changePassword=true", {
      method: "PUT",
      body: JSON.stringify({ ...data, username }),
    });
    if (!response.success) {
      setMessage({
        type: "error",
        message: response.message,
        showMessage: true,
      });
      setIsLoading(false);
      return;
    }

    setMessage({
      type: "success",
      message: response.message,
      showMessage: true,
    });
    setIsLoading(false);
    reset();
   const timeOut: NodeJS.Timeout = setTimeout(() => {
      setMessage({ ...message, showMessage: false });
    }, 3000);

    return () => clearTimeout(timeOut);
  };
  return (
    <main className="bg-white w-full h-100px flex flex-col p-4 rounded-md gap-5">
      {message?.showMessage && message?.type === "success" && (
        <Toast message={message.message} Icon={FaRegCircleCheck} />
      )}
      <section>
        <div>
          <h1 className="text-center font-san font-semibold text-xl">
            Change Password
          </h1>
        </div>
        {message?.showMessage && message?.type === "error" && (
          <p className="text-red-500 p-1 text-sm lg:text-base font-semibold text-center w-full bg-red-200 my-3 border-2 border-red-600 rounded-md ">
            {message?.message}
          </p>
        )}
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col my-5">
              <div className="flex flex-row w-full gap-0 items-center">
                <span className="text-red-500 ml-1">*</span>
                <label className="block text-sm font-medium text-gray-700">
                  Old Password
                </label>
              </div>
              <input
                type="password"
                className="block text-sm font-sans w-full px-5 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm desktop:text-base laptop:text-base tablet:text-sm phone:text-xs"
                // name="current_password"
                {...register("oldPassword")}
                onInput={() => setMessage({ ...message, showMessage: false })}
              />
            </div>
            {errors.oldPassword && (
              <p className=" text-red-500 p-1 text-sm lg:text-base font-semibold ">
                {errors.oldPassword.message}
              </p>
            )}
            <div className="flex flex-col my-5">
              <div className="flex flex-row w-full gap-0 items-center">
                <span className="text-red-500 ml-1">*</span>
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
              </div>
              <input
                type="password"
                className="block text-sm font-sans w-full px-5 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm desktop:text-base laptop:text-base tablet:text-sm phone:text-sx"
                // name="password"
                {...register("newPassword")}
                onInput={() => setMessage({ ...message, showMessage: false })}

              />
            </div>
            {errors.newPassword && (
              <p className=" text-red-500 p-1 font-semibold text-sm lg:text-base">
                {errors.newPassword.message}
              </p>
            )}
            <div className="flex flex-col my-5">
              <div className="flex flex-row w-full gap-0 items-center">
                <span className="text-red-500 ml-1">*</span>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
              </div>
              <input
                type="password"
                className="block text-sm font-sans w-full px-5 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 desktop:text-base laptop:text-base tablet:text-sm phone:text-xs"
                // name="confirm_password"
                {...register("confirmPassword")}
                onInput={() => setMessage({ ...message, showMessage: false })}

              />
            </div>
            {errors.confirmPassword && (
              <p className=" text-red-500 p-1 font-semibold text-sm lg:text-base">
                {errors.confirmPassword.message}
              </p>
            )}

            {/* <input type="hidden" name="username" value={username} /> */}
            <button
              className={`btn w-full text-sm lg:text-base flex items-center disabled:bg-gray-300 rounded-md justify-center gap-3 bg-[rgb(90,191,249)]  text-white py-2 mt-3 focus:outline-none font-bold font-mono hover:bg-blue-400 duration-100 transition-all`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner text-neutral"></span>
              ) : (
                "UPDATE PASSWORD"
              )}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
