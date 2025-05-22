import React, { useRef, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { toCapitalized } from "../lib/helperFunctions";
import { useProfile } from "../context/ProfileContext";
import Image from "next/image";
import { CustomFile } from "../lib/types";
import { blobToFile } from "../lib/helperFunctions";
import ProfileForm from "./ProfileForm";
import Modal from "./Modal";
import { useAuth } from "../context/AuthContext";
import { makeRequest } from "../lib/helperFunctions";
import { useProfileImageUpdate } from "../lib/customHook";

interface ProfileProps {
  profile: any;
  entity: "parent" | "kid" | unknown;
}

const ProfileComponent = ({ profile, entity }: ProfileProps) => {
  const isParent = entity === "parent";
  const { profilePicture, updateProfilePicture } = useProfile();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<string | any>();
  // const [pending, setPending] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null) as React.MutableRefObject<HTMLFormElement>;
  const { user } = useAuth();

  const { submit, pending, message } = useProfileImageUpdate({
    user: user!,
    updateProfilePicture,
    formRef,
  });
  // const [message, setMessage] = useState<{
  //   type?: string;
  //   message?: string;
  //   showMessage?: boolean;
  // }>({});
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const file = event.target.files?.[0];
    if (file) {
      // const reader = new FileReader();
      const fileUrl: CustomFile | any = URL.createObjectURL(file);
      setProfileImage(fileUrl);
      setModalOpen(true);
      console.log(fileUrl);
      // reader.onloadend = () => {
      //   // You can also upload the file to the server here
      // };

      // reader.readAsDataURL(file);
    }
  };

  async function useProfilePhoto(e: React.FormEvent) {
    e.preventDefault();
    await submit(profileImage); // profileImage is the Blob
    console.log({message})
    if(message.type !== "error")
    setModalOpen(false);
  }
  return (
    <React.Fragment>
      <div className="mt-4 bg-[rgb(236,239,245)] shadow-md rounded-sm p-6 w-1/2 m-auto relative">
        <div
          className="w-28 h-28 rounded-full border-2 border-slate-400 mx-auto mb-4 relative cursor-pointer shadow-lg"
          onClick={handleClick}
        >
          {profilePicture && (
            <Image
              src={`/uploads/${profilePicture}`}
              alt="profile picture"
              width={100}
              height={100}
              className=" rounded-full border-white border-solid w-full h-full"
            />
          )}
          <CiEdit
            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-blue-500 text-white font-bold rounded-full p-1 shadow-md cursor-pointer"
            size={20}
          />

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
        <div className="text-center mb-4">
          <h2 className="text-2xl lg:text-3xl font-semibold text-center mb-2 text-[rgb(39,41,54)]">
            {profile?.username || profile.childName}
          </h2>
          <span className="text-gray-400">{toCapitalized(profile?.role)}</span>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row flex-wrap gap-4  mx-auto p-4">
        {/* Email Section */}
        <div className="flex flex-col sm:flex-row items-center  rounded-sm p-4 shadow-sm w-full lg:w-auto">
          <span className="text-gray-600 text-base min-w-[120px]">{isParent ? "Email:" : "Login ID:"}</span>
          <span className="text-gray-500 font-semibold rounded mt-2 sm:mt-0 sm:ml-5 border border-slate-400 px-3 py-1 text-sm font-mono break-all">
            {isParent ? profile?.email : profile?.loginId}
          </span>
        </div>

        {/* Wallet Section */}
        <div className="flex flex-col sm:flex-row items-center rounded-sm p-4 shadow-sm w-full lg:w-auto">
          <span className="text-gray-600 text-base min-w-[120px]">
            Wallet Address
          </span>
          <span className="text-gray-500 font-semibold sm:w-full rounded mt-2 sm:mt-0 sm:ml-5 border border-slate-400 px-3 py-1 text-sm font-mono break-all">
            {profile?.address || profile?.childAddress}
          </span>
        </div>
        <ProfileForm
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          profileImage={profileImage}
          handleClick={handleClick}
          pending={pending}
          message={message}
          useProfilePhoto={useProfilePhoto}
          formRef={formRef}
        />
      </div>
    </React.Fragment>
  );
};

export default ProfileComponent;
