import React, { useCallback, useEffect, useState } from "react";
import { IAccount } from "../../lib/types";
import { formatDate } from "../../lib/helperFunctions";
import QuickAccountButtons from "../QuickAccountButtons";
import { useSubmitTransaction } from "@/app/lib/customHook";
import { useAuth } from "@/app/context/AuthContext";
type Message = {
  text: string | undefined;
  showMessage: boolean;
  type?: string;
};

const Account = ({ account }: IAccount) => {

  // const [url, setUrl] = React.useState("");
  let url = ""
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState<Message | any>({text: "", showMessage: false, type: ""});
  const { submitTransaction,  loading, transaction } = useSubmitTransaction(message, setMessage, () => {});
  const { user } = useAuth();
  const closeModal = useCallback(() => {
    message.type === "success" && setModalOpen(false);
    message.type === "error" && setModalOpen(true);
  },[message.type, setModalOpen]); 
  

  useEffect(() => {
    closeModal()
  },[message, closeModal]);

  const deposit = async (childAddress: string, email:string, userId:string, amount: number) => {
    console.log("Deposit function called", { childAddress, email, userId, amount });
    submitTransaction({childAddress, userId, amount},"/api/kids/accounts/activate");
  }
  const withdraw = async (childAddress: string, email:string, userId:string, amount: number) => {
    console.log("Deposit function called", { childAddress, email, userId, amount });
    submitTransaction({childAddress, userId, amount},"/api/kids/accounts/activate");
  }
  const setAllowance = async (childAddress: string, email:string, userId:string, amount: number) => {
    console.log("Deposit function called", { childAddress, email, userId, amount });
    submitTransaction({childAddress, userId, amount},"/api/kids/accounts/activate");
  }

  const activate = async (childAddress: string, email:string, userId:string) => {
    console.log("Deposit function called", { childAddress, email, userId });

    submitTransaction({childAddress, userId}, "/api/kids/accounts/activate");
    console.log(message)
  }
  return (
    <div
      id={account._id}
      className="flex flex-col gap-2 p-4 border-b border-gray-200 w-full overflow-x-auto"
    >
      <div className="flex flex-col lg:flex-row w-full justify-between lg:items-center">
        <p className="text-sm lg:text-base font-semibold text-gray-500">
          Child Name
        </p>
        <p className="text-sm  text-gray-500 ">
          {account.childName}
        </p>
      </div>
      <div className="flex flex-col lg:flex-row w-full justify-between lg:items-center">
        <p className="text-sm lg:text-base font-semibold text-gray-500">
          Login ID
        </p>
        <p className="text-sm  text-gray-500 ">
          {account.loginId}
        </p>
      </div>
      <div className="flex flex-col lg:flex-row w-full justify-between lg:items-center">
        <p className="text-sm lg:text-base font-semibold text-gray-500">Child Address</p>
        <p className="text-sm  text-gray-500 l">{account.childAddress}</p>
      </div>
      
      <div className="flex flex-col lg:flex-row w-full justify-between lg:items-center">
        <p className="text-sm lg:text-base font-semibold text-gray-500">
          Account Creation Date
        </p>
        <p className="text-sm  text-gray-500 ">
          {formatDate(account.createdAt)}
        </p>
      </div>
      <QuickAccountButtons 
        account={account} 
        deposit={deposit} 
        activate={activate} 
        withdraw={withdraw} 
        setAllowance={setAllowance}
        message={message}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        loading={loading}
        userRole={[user?.role]}
        />
    </div>
  );
};

export default Account;
