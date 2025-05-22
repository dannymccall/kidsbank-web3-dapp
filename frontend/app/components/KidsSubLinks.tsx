import Link from "next/link";
import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { setActiveTab } from "../redux/slices/uiSlice";

const KidsSubLinks = ({ isOpen, role }: { isOpen: boolean; role: string }) => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state: any) => state.ui.activeTab);
  return (
    <React.Fragment>
        {role === "parent" && (
      <div className="w-full">
        <h1
          className={`w-full ${
            isOpen ? "bg-slate-100" : "bg-[rgb(80,186,248)]"
          } p-2 text-gray-600 font-semibold font-sans`}
        >
          Accounts Section
        </h1>
          <>
            <Link
              href="/accounts/create-account"
              className={`block px-4 py-2 hover:bg-gray-200  transition duration-300 ${
                activeTab === "/accounts/create-account"
                  ? "btn btn-sm bg-blue-500 text-white font-bold"
                  : ""
              }`}
              onClick={() => dispatch(setActiveTab("/accounts/create-account"))}
            >
              Create Kid Account
            </Link>
            <Link
              href="/accounts/activate"
              className="block px-4 py-2 hover:bg-blue-200 transition duration-300"
            >
              Activate Account
            </Link>
            <Link
              href="/kids/goals"
              className="block px-4 py-2 hover:bg-blue-200 transition duration-300"
            >
              Deactivate Account
            </Link>
          </>
      </div>
        )}
      <div className="w-full">
        <h1
          className={`w-full ${
            isOpen ? "bg-slate-100" : "bg-[rgb(80,186,248)]"
          } p-2 text-gray-600 font-semibold font-sans`}
        >
          Transactions Section
        </h1>

        <Link
          href="/transactions/deposit"
          className="block px-4 py-2 hover:bg-blue-200 transition duration-300 "
        >
          Deposit
        </Link>
        <Link
          href="/transactions/withdraw"
          className="block px-4 py-2 hover:bg-blue-200 transition duration-300"
        >
          Withdraw
        </Link>
        <Link
          href="/transactions/allowance"
          className="block px-4 py-2 hover:bg-blue-200 transition duration-300"
        >
          Set Allowance
        </Link>
      </div>
    </React.Fragment>
  );
};

export default KidsSubLinks;
