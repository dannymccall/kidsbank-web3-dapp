"use client";
import React, { useEffect, useCallback } from "react";
import { makeRequest, toCapitalized } from "@/app/lib/helperFunctions";
import { useAuth } from "@/app/context/AuthContext";
import Loader from "@/app/components/Loader";

import ParentProfile from "@/app/components/ParentProfile";
import ChildProfile from "@/app/components/ChildProfile";
const UserProfile = () => {
  const { user } = useAuth();
  const isParent = user?.role === "parent";
  console.log(user?.role);

  const [parent, setParent] = React.useState<any>(null);
  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await makeRequest(
        `/api/auth/user?userId=${user?.userId}&role=${user?.role}&loginId=${user?.loginId}`,
        {
          method: "GET",
        }
      );
      setParent(response);
      return response;
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  return (
    <main className="bg-white min-h-screen flex flex-col w-full relative">
      {!parent ? (
        <Loader />
      ) : isParent ? (
        <ParentProfile
          profile={parent}
          entity={user?.role}
          username={user?.username}
        />
      ) : (
        <ChildProfile
          profile={parent}
          entity={user?.role}
        />
      )}
    </main>
  );
};

export default UserProfile;
