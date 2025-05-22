import React, { useState } from "react";
import { Account } from "../lib/types";
import { useAuth } from "../context/AuthContext";
import Modal from "./Modal";

interface QuickAccountButtonsProps {
  // Define any props if needed
  account: Account;
  deposit: (
    childAddress: string,
    email: string,
    userId: string,
    amount: number
  ) => any;
  withdraw: (
    childAddress: string,
    email: string,
    userId: string,
    amount: number
  ) => any;
  setAllowance: (
    childAddress: string,
    email: string,
    userId: string,
    amount: number
  ) => any;
  activate: (childAddress: string, email: string, userId: string) => any;
  loading: boolean;
  message: {
    text?: string;
    showMessage?: boolean;
    type?: string;
  };
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userRole?: any[];
}

const QuickAccountButtons = ({
  account,
  deposit,
  activate,
  withdraw,
  setAllowance,
  message,
  loading,
  modalOpen,
  setModalOpen,
  userRole
}: QuickAccountButtonsProps) => {
  const { user } = useAuth();
  const [modalType, setModalType] = useState<
    "Deposit" | "Withdraw" | "Activate" | "Allowance" | null
  >(null);
  const [amount, setAmount] = useState("");
  
  const buttons = [
    { name: "Deposit", action: () => openModal("Deposit"), role: ["parent"] },
    { name: "Withdraw", action: () => openModal("Withdraw"), role: ["kid", "parent"] },
    {
      name: "Activate Account",
      action: () => openModal("Activate"),
      role: ["parent"],
    },
    { name: "Set Allowance", action: () => openModal("Allowance"), role: ["parent"] },
  ];

  const openModal = (type: typeof modalType) => {
    setModalType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);

    setAmount("");
  };

  const handleSubmit = () => {
    const ethAmount = parseFloat(amount);
    switch (modalType) {
      case "Deposit":
        deposit(
          account.childAddress,
          user?.email || "",
          user?.userId || "",
          ethAmount
        );
        break;
      case "Withdraw":
        withdraw(
          account.childAddress,
          user?.email || "",
          user?.userId || "",
          ethAmount
        );
        break;
      case "Allowance":
        setAllowance(
          account.childAddress,
          user?.email || "",
          user?.userId || "",
          ethAmount
        );
        break;
    }
    // closeModal();
  };

  const hasPermission = (entity: string[]) => entity.some((value) => userRole?.includes(value));


  const renderModalContent = () => {
    if (modalType === "Activate") {
      return (
        <div className="text-center">
          {message.showMessage && (
            <div
              className={`alert ${
                message.type === "error" ? "alert-error" : "alert-success"
              } my-4 font-bold`}
            >
              {message.text}
            </div>
          )}
          <h2 className="text-lg font-bold mb-4">Activate this account?</h2>

          <div className="flex justify-center gap-4">
            {loading ? (
              <span className="loading loading-spinner text-neutral"></span>
            ) : (
              <>
                <button
                  onClick={() => {
                    activate(
                      account.childAddress,
                      user?.email || "",
                      user?.userId as string
                    );
                  }}
                  className="btn btn-success"
                >
                  Yes
                </button>
                <button onClick={closeModal} className="btn btn-error">
                  No
                </button>
              </>
            )}
          </div>
        </div>
      );
    }

    return (
      <div>
        {message.showMessage && (
          <div
            className={`alert ${
              message.type === "error" ? "alert-error" : "alert-success"
            } my-4 font-bold`}
          >
            {message.text}
          </div>
        )}
        <label className="block mb-2 font-semibold">
          {modalType} Amount (ETH)
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input input-bordered w-full mb-4"
        />
        <button onClick={handleSubmit} className="btn btn-primary w-full">
          {loading ? (
            <span className="loading loading-spinner text-neutral"></span>
          ) : (
            "Confirm"
          )}
        </button>
      </div>
    );
  };
  return (
    <>
      <div className="flex flex-col lg:flex-row gap-4 mt-4">
        {buttons
          .filter((button) => hasPermission(button.role))
          .map((button, index) => (
            <button
              key={index}
              onClick={button.action}
              className="btn btn-sm bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 cursor-pointer"
            >
              {button.name}
            </button>
          ))}
      </div>
      <Modal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        onClose={closeModal}
        width="max-w-md"
      >
        {renderModalContent()}
      </Modal>
    </>
  );
};

export default QuickAccountButtons;
