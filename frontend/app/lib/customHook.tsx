// hooks/useProfileImageUpdate.ts
import { useState } from "react";
import { blobToFile, makeRequest } from "./helperFunctions";
import {
  processedData,
  processedDataFailure,
  processingData,
} from "@/app/redux/slices/apiSlice";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "@/app/context/AuthContext";
import { RootState, AppDispatch } from "@/app/redux/store";

type UserType = {
  userId: string;
  role: string;
  loginId?: string;
};

type MessageType = {
  showMessage: boolean;
  message: string;
  type: "successMessage" | "error";
};

export function useProfileImageUpdate({
  user,
  updateProfilePicture,
  formRef,
}: {
  user: UserType;
  updateProfilePicture: (data: any) => void;
  formRef: React.RefObject<HTMLFormElement>;
}) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<MessageType>({
    showMessage: false,
    message: "",
    type: "successMessage",
  });

  const submit = async (profileImage: Blob | any) => {
    setPending(true);
    const photo: any = await blobToFile(profileImage, "profile-image");
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    formData.append("profileImage", photo);

    const response = await makeRequest(
      `/api/auth/user?userId=${user.userId}&role=${user.role}&loginId=${user.loginId}`,
      {
        method: "PUT",
        body: formData,
      }
    );

    if (!response.success) {
      console.log({ response });
      setPending(false);
      setMessage({
        showMessage: true,
        message: response.message,
        type: "error",
      });
      return;
    }

    updateProfilePicture(response.updatedProfilePicture);
    setPending(false);
    console.log({ response });
    setMessage({
      showMessage: true,
      message: response.message,
      type: "successMessage",
    });

    let timeOut: NodeJS.Timeout = setTimeout(() => {
      setMessage((prev) => ({ ...prev, showMessage: false }));
    }, 1000);

    return () => clearTimeout(timeOut);
  };

  return {
    submit,
    pending,
    message,
  };
}

type Message = {
  showMessage?: boolean;
  text?: string;
  type?: string;
};

export function useSubmitTransaction(
  message: Message,
  setMessage: React.Dispatch<React.SetStateAction<Message>>,
  reset?: () => void
) {
  const dispatch = useDispatch<AppDispatch>();
  const { data: transaction, loading } = useSelector(
    (state: RootState) => state.api
  );
  const { user } = useAuth();
  // const [message, setMessage] = useState({ showMessage: false, text: "", type: "" });

  const submitTransaction = async (data: any, url: string) => {
    dispatch(processingData());

    try {
      const response = await makeRequest(url, {
        method: "POST",
        body: JSON.stringify({
          ...data,
          userId: user?.userId,
          email: user?.email,
          role: user?.role,
          loginId: user?.loginId,
        }),
      });

      if (response.success) {
        dispatch(processedData(response.transaction));
        setMessage({
          showMessage: true,
          text: "Account Activated",
          type: "success",
        });

        reset && reset();
      } else {
        dispatch(processedDataFailure());
        setMessage({
          showMessage: true,
          text: response.message,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Request failed", error);
      dispatch(processedDataFailure());
    }
  };

  return { submitTransaction, message, loading, transaction };
}
