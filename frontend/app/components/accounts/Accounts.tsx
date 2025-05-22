import React from "react";
import { AccountProps } from "../../lib/types";
import Account from "./Account";

const Accounts = ({ accounts }: AccountProps) => {
  return (
    <main className="w-full">
      {accounts.length > 0 ? (
        accounts.map((account) => (
          <Account key={account._id} account={account} />
        ))
      ) : (
        <h1 className="text-gray-500 font-semibold">No accounts yet !!!</h1>
      )}
    </main>
  );
};

export default Accounts;
