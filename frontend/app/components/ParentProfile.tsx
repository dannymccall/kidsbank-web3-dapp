import React from "react";
import ProfileComponent from "./ProfileComponent";
import TabComponent from "./Tabs";
import { useAuth } from "../context/AuthContext";
import { TbRouteAltRight, TbTransactionBitcoin } from "react-icons/tb";
import { IoSettings } from "react-icons/io5";
import { ChangePassword } from "./ChangePassword";
import Transactions from "./Transactions/Transactions";
import Accounts from "./accounts/Accounts";

interface ProfileProps {
    profile: any;
    entity: "parent" | "kid" | unknown;
    username:string
  }
const ParentProfile = ({profile, entity, username}: ProfileProps) => {

  const tabs = [
    {
      label: <TbRouteAltRight size={20} />,
      content: <Accounts accounts={profile.accounts} />,
    },
    {
      label: <TbTransactionBitcoin size={20} />,
      content: <Transactions  transactions={profile.transactions}/>,
    },
    {
      label: <IoSettings size={20} />,
      content: <ChangePassword username={username}/>,
    },
  ];
  return (
    <React.Fragment>
      <div className="flex flex-col  lg:w-5xl w-full my-3 mx-auto max-h-fit bg-[rgb(236,239,245)] relative">
        {/* <h1 className="text-2xl font-bold mb-4">User Profile</h1>
                <p className="text-lg">Welcome to your profile page!</p> */}
        <ProfileComponent entity={entity} profile={profile} />
      </div>
      <div className="lg:w-5xl w-full mx-auto">
        <TabComponent tabs={tabs} className="h-96 overflow-y-auto"/>
      </div>
    </React.Fragment>
  );
};

export default ParentProfile;
