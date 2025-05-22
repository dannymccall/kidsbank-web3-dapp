"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { DepositSchema } from "@/app/lib/definitions";
import Logo from "@/public/logo.png";
import Image from "next/image";
import { makeRequest } from "@/app/lib/helperFunctions";
import Web3 from "web3";
import { FaEthereum, FaUser } from "react-icons/fa";
import { RootState, AppDispatch } from "@/app/redux/store";
import {
  processedData,
  processedDataFailure,
  processingData,
} from "@/app/redux/slices/apiSlice";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "@/app/context/AuthContext";

type FormData = z.infer<typeof DepositSchema>;

const Withdraw = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(DepositSchema),
  });

  const { user } = useAuth();


  const [message, setMessage] = useState<{
    text?: string;
    showMessage?: boolean;
  }>({});

  const dispatch = useDispatch<AppDispatch>();
  const { data: transaction, loading } = useSelector(
    (state: RootState) => state.api
  );

  const onSubmit = async (data: FormData) => {
    dispatch(processingData());
    
    try {
      console.log(user?.userId)
      const response = await makeRequest("/api/kids/transactions/withdraw", {
        method: "POST",
        body: JSON.stringify({...data, userId: user?.userId, email: user?.email, role: user?.role}),
      });
  
      if (response.success) {
        dispatch(processedData(response.transaction)); // Ensure it's an array
        setMessage({ showMessage: true });
        reset();
      } else {
        dispatch(processedDataFailure());
      }
    } catch (error) {
      console.error("Request failed", error);
      dispatch(processedDataFailure());
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <div className="w-full flex justify-center mb-2">
          <Image src={Logo} alt="logo" width={100} className="text-center" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-4">
          Make a Withdraw
        </h2>

        {message.showMessage ? (
          <div className="text-center">
            Trunsaction successful!
            <h1>{transaction?.Status }</h1>
            <button className="btn btn-sm bg-[rgb(90,191,249)] text-white" onClick={() => setMessage({showMessage: false})}>Make Another Withdrawal</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Child Address */}
            <div>
              <label className="block font-semibold mb-1">
                Ethereum Address
              </label>
              <div className="relative">
                <FaEthereum className="absolute left-3 top-3 text-gray-400" />
                <input
                  {...register("childAddress")}
                  type="text"
                  placeholder="0x123...abc"
                  className="w-full px-4 py-2 pl-10 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {errors.childAddress && (
                <p className="text-red-500 text-sm">
                  {errors.childAddress.message}
                </p>
              )}
            </div>


            {/* Age */}
            <div>
              <label className="block font-semibold mb-1">Amount</label>
              <input
                {...register("amount", { valueAsNumber: true })}
                type="number"
                placeholder="Enter amount"
                className="w-full px-4 py-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.amount && (
                <p className="text-red-500 text-sm">{errors.amount.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn w-full font-mono bg-[rgb(90,191,249)] text-white py-2 rounded-md hover:bg-blue-600 transition-all duration-300 cursor-pointer disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner text-neutral"></span>
              ) : (
                "WITHDRAW"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Withdraw;
