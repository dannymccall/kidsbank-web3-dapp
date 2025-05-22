import React from "react";
import { TransactionProps } from "../../lib/types";
import Transaction from "./Transaction";

const Transactions = ({ transactions }: TransactionProps) => {
  return (
    <main className="w-full">
      {transactions.length > 0 ? (
        transactions.map((transaction) => (
          <Transaction key={transaction._id} transaction={transaction} />
        ))
      ) : (
        <h1 className="text-gray-500 font-semibold">No Transactions yet !!!</h1>
      )}
    </main>
  );
};

export default Transactions;
