import React from "react";
import { ITransaction } from "../../lib/types";
import { formatDate } from "../../lib/helperFunctions";

const Transactions = ({ transaction }: ITransaction) => {
  return (
    <div
      id={transaction._id}
      className="flex flex-col gap-2 p-4 border-b border-gray-200 w-full overflow-x-auto"
    >
      <div className="flex flex-col lg:flex-row w-full justify-between lg:items-center">
        <p className="text-sm lg:text-base font-semibold text-gray-500">
          Transaction Hash
        </p>
        <p className="text-sm  text-gray-500 ">
          {transaction.transactionHash}
        </p>
      </div>
      <div className="flex flex-col lg:flex-row w-full justify-between lg:items-center">
        <p className="text-sm lg:text-base font-semibold text-gray-500">
          Transaction Status
        </p>
        <p className="text-sm  text-gray-500 ">
          {transaction.transactionStatus}
        </p>
      </div>
      <div className="flex flex-col lg:flex-row w-full justify-between lg:items-center">
        <p className="text-sm lg:text-base font-semibold text-gray-500">From</p>
        <p className="text-sm  text-gray-500 l">{transaction.from}</p>
      </div>
      <div className="flex flex-col lg:flex-row w-full justify-between lg:items-center">
        <p className="text-sm lg:text-base font-semibold text-gray-500">To</p>
        <p className="text-sm  text-gray-500 ">{transaction.to}</p>
      </div>
      <div className="flex flex-col lg:flex-row w-full justify-between lg:items-center">
        <p className="text-sm lg:text-base font-semibold text-gray-500">
          Transaction Date
        </p>
        <p className="text-sm  text-gray-500 ">
          {formatDate(transaction.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default Transactions;
