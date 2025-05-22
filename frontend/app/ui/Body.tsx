"use client";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import KidsImage from "@/public/kids_image_5.jpg";
import KidsImage2 from "@/public/kids_image_3.webp";
import KidsImage3 from "@/public/kids_image_2.jpg";
import Link from "next/link";
import { motion } from "framer-motion";
import EmailTemplate from "../components/EmailTemplate";
import { IoIosArrowRoundForward } from "react-icons/io";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/Modal";
import { makeRequest } from "../lib/helperFunctions";
import Web3 from "web3";
const Body = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to top when the component mounts
  }, []);
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleOpenModal = useCallback(() => {
    if (user && user?.role === "parent" && !user?.isVerified) {
      setModalOpen(true);
    }
  }, [user]);

  useEffect(() => {
    handleOpenModal();
  }, [handleOpenModal]);

  // useEffect(() => {

  //   (async() => {
  //     const web3 = new Web3("ws://127.0.0.1:9545");
  //     console.log(await web3.eth.getTransactionCount("0x5f65c3073138eeaea9a3c55e0b662453a247659e"))

  //   })()
  // },)

  // useEffect(() => {
  //   // ensure that there is an injected the Ethereum provider
  //   if (window.ethereum) {
  //     // use the injected Ethereum provider to initialize Web3.js
      
  //     // check if Ethereum provider comes from MetaMask
  //     if (window.ethereum.isMetaMask) {
  //       alert("Metamask connected")
  //     } else {
  //       alert("Metamask not connected")

  //     }
  //   } else {
  //     // no Ethereum provider - instruct user to install MetaMask
     
  //   }
  // }, []);

  const sendEmailVerification = async () => {
    setIsLoading(true);
    const response = await makeRequest(`/api/signup/auth?email=true`, {
      method: "POST",
      body: JSON.stringify({ email: user?.email, username: user?.username }),
    });

    if (!response) {
      console.log("Something happened");
      return;
    }
    setIsLoading(false);
    setModalOpen(false);
  };

  return (
    <div className="w-full flex flex-1 flex-col gap-10 pb-0 mb-auto ">
      {/* Wrapper for content */}

      <Modal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        onClose={() => {}}
      >
        <div className="w-full flex flex-col gap-3">
          <h1 className="text-2xl md:text-3xl font-bold">
            Email Verification ⚠️
          </h1>
          <h1 className="text-base text-red-500 font-bold">
            Please your email is not verified
          </h1>
          <p>
            Check your email or use this{" "}
            <button
              className="btn btn-sm bg-[rgb(90,191,249)] cursor-pointer"
              onClick={sendEmailVerification}
              
            >
              {isLoading ? (
                <span className="loading loading-spinner text-neutral loading-sm"></span>
              ) : (
                "link"
              )}
            </button>{" "}
            to send a new email{" "}
          </p>
        </div>
      </Modal>

      <div className="flex flex-col lg:flex-row w-full">
        {/* Left Section (Text) */}
        <div className="w-full  lg:w-1/2 flex flex-col items-start justify-center px-6 py-10 lg:pl-16 bg-gray-50">
          <div className="w-full">
            <motion.div
              //   style={ball}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.5,
                ease: [0, 0.71, 0.2, 1.01],
              }}
              className="min-w-full"
            >
              <div className="w-full ">
                <div className="w-full flex flex-col items-start justify-center">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                    Welcome to <span className="text-blue-500">KidsBank</span>
                  </h1>
                  <p className="text-gray-600 mt-2 text-lg md:text-xl">
                    Smart Money, Bright Future.
                  </p>
                  {!user && (
                    <Link
                      href="signup"
                      className="mt-4 px-6 py-3 bg-[rgb(90,191,249)] hover:bg-blue-500 text-white font-semibold rounded-lg shadow-md transition duration-300 link-btn flex gap-5 items-center"
                    >
                      Get Started{" "}
                      <IoIosArrowRoundForward className="relative icon-move-left" />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Section (Image) - Full Width */}
        <div className="w-full lg:w-1/2">
          <Image
            src={KidsImage}
            alt="Kids saving money"
            className="w-full h-full object-cover"
            priority
          />
        </div>
      </div>
      <div className="w-full flex flex-col gap-10 px-4 md:px-8 lg:px-16">
        {/* First Section */}
        <div className="w-full flex flex-col-reverse lg:flex-row justify-evenly items-center gap-6">
          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.5,
              ease: [0, 0.71, 0.2, 1.01],
            }}
            className="bg-gray-100 rounded-lg p-5 md:p-10 lg:p-16 hover:translate-x-5 transition-all duration-300"
          >
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
              Empowering Young Savers.
            </h1>
            <p className="text-gray-600 mt-2 text-base md:text-lg lg:text-xl">
              Save with us ❤️!!!
            </p>
          </motion.div>

          {/* Right Image */}
          <div className="w-full max-w-xs sm:max-w-md lg:max-w-lg">
            <Image
              src={KidsImage2}
              alt="Kids saving money"
              className="w-full h-auto rounded-xl shadow-lg"
              priority
            />
          </div>
        </div>

        {/* Second Section */}
        <div className="w-full flex flex-col lg:flex-row justify-evenly items-center gap-6">
          {/* Left Image */}
          <div className="w-full max-w-xs sm:max-w-md lg:max-w-lg">
            <Image
              src={KidsImage3}
              alt="Kids saving money"
              className="w-full h-auto rounded-xl shadow-lg"
              priority
            />
          </div>

          {/* Right Text */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.5,
              ease: [0, 0.71, 0.2, 1.01],
            }}
            className="bg-[rgb(90,191,249)] rounded-lg p-5 md:p-10 lg:p-16 hover:scale-110 transition-all duration-300"
          >
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
              Dream, Save, Achieve.
            </h1>
            <p className="text-gray-600 mt-2 text-base md:text-lg lg:text-xl">
              Transact with us ❤️!!!
            </p>
          </motion.div>
        </div>
      </div>
      <main className="w-full flex flex-col lg:flex-row px-4 lg:px-16 item-center bg-gray-100 justify-center">
        <div className="p-4 rounded-lg w-full max-h-96  bg-[rgb(90,191,249)] flex-col justify-center items-center mt-10 lg:m-auto ">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 ">
            💡 Smart Money Tip
          </h2>
          <p className="text-gray-700 mt-2 text-lg md:text-xl">
            Save 10% of your allowance every week to reach your goals faster!
          </p>
        </div>

        <EmailTemplate />
      </main>
    </div>
  );
};

export default Body;
