// components/RemoveItemModal.js
import React, { useContext, useState } from "react";
import { RiLockPasswordLine } from "react-icons/ri";
import { StateSharingContext } from "../contexts";
import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
} from "firebase/auth";
import Modal from "./Modal";
import InputField from "../components/InputField";
import { handleFieldChange, validateFields } from "../utils/helpers";
import { toast } from "react-toastify";

export default function ReauthenticateAndChangeEmailModal({}) {
  const [formData, setFormData] = useState({
    newEmail: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [firebaseErrors, setFirebaseErrors] = useState({});
  const { showReauthenticateModal, setShowReauthenticateModal, userToken } =
    useContext(StateSharingContext);

  const handleChange = handleFieldChange(setFormData, setFormErrors);

  const validateForm = () => {
    const fieldsToValidate = ["newEmail"];
    return validateFields(fieldsToValidate, setFormErrors, formData);
  };

  const handleEmailChange = async (newEmail) => {
    if(!userToken){
      toast.error("No user is currently signed in.");
      return;
    }
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("No user is currently signed in.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      // Reauthenticate the user
      const response = await fetch("http://127.0.0.1:4242/update-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`
        },
        body: JSON.stringify({ newEmail: newEmail, uid: user.uid }),
      });

      if (!response.ok) {
        const errorResult = await response.json()
        throw new Error(errorResult.error || "Failed to update email")
      }
      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);     
      }

      console.log("Email updated successfully.");
      toast.success("Email updated successfully.");
      // Optionally, update the state to close the modal
      setShowReauthenticateModal({ state: false });
    } catch (error) {
      console.error("Error during reauthentication or email update:", error);
      toast.error(error.message);
    }
  };

  const handleCloseModal = () => {
    setShowReauthenticateModal({ state: false });
  };

  const title = (
    <div className="flex items-center gap-2">
      <RiLockPasswordLine size={30} />{" "}
      <p className="text-xl font-bold">Change email</p>
    </div>
  );

  const content = (
    <div>
      <p className="text-sm text-slate-600 text-center">
        Please enter your password to change your email.
      </p>
      <div className="flex flex-col gap-5 mt-3 mb-2">
        <InputField
          data={formData.newEmail}
          setData={(value) => handleChange("newEmail", value)}
          error={formErrors.newEmail}
          label={"New email"}
          placeholder={"Create a new email"}
          type={"email"}
        />{" "}
      </div>
    </div>
  );

  const actions = [
    {
      label: "Authenticate",
      className:
        "border-2 text-sm border-black bg-black text-white hover:bg-white hover:text-black",
      onClick: () =>
        handleEmailChange(
          formData.newEmail
        ),
    },
    {
      label: "Cancel",
      className: "border-2 border-gray-300",
      onClick: handleCloseModal,
    },
  ];

  return (
    <Modal
      title={title}
      content={content}
      actions={actions}
      open={showReauthenticateModal.state}
    />
  );
}
