import React from "react";
import ProfileComponent from "./ProfileComponent";
import TabComponent from "./Tabs";
import Transactions from "./Transactions/Transactions";
import Accounts from "./accounts/Accounts";
import { SiMainwp } from "react-icons/si";
import { TbTransactionBitcoin } from "react-icons/tb";

interface ProfileProps {
  profile: any;
  entity: "parent" | "kid" | unknown;
}
const ChildProfile = ({ profile, entity }: ProfileProps) => {
  const childProfileAccount = [
    {
      childName: profile.childName,
      _id: profile._id,
      loginId: profile.loginId,
      createdAt: profile.createdAt,
      childAddress: profile.childAddress,
    },
  ];
  const isParent = entity === "parent";
  const tabs = [
    {
      label: <SiMainwp size={20} />,
      content: (
        <Accounts
          accounts={isParent ? profile.accounts : childProfileAccount}
        />
      ),
    },
    {
      label: <TbTransactionBitcoin size={20} />,
      content: <Transactions  transactions={profile.transactions}/>,
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

export default ChildProfile;
