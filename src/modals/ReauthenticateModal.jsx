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
import { handleFieldChange } from "../utils/helpers";

export default function ReauthenticateAndChangeEmailModal({ }) {
    const [formData, setFormData] = useState({
        newEmail: "",
        password: "",
      });
      const [formErrors, setFormErrors] = useState({});
      const [firebaseErrors, setFirebaseErrors] = useState({})
  const {
    showReauthenticateModal,
    setShowReauthenticateModal,
  } = useContext(StateSharingContext);

  const handleChange = handleFieldChange(setFormData, setFormErrors);

  const handleReauthenticationAndEmailChange = async (
    currentPassword,
    newEmail
  ) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("No user is currently signed in.");
      return;
    }

    try {
      // Reauthenticate the user
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Change the email
      await updateEmail(user, newEmail);
      console.log("Email updated successfully.");

      // Optionally, update the state to close the modal
      setShowReauthenticateModal({ state: false });
    } catch (error) {
      console.error("Error during reauthentication or email update:", error);

      // Optionally, handle specific error messages
      if (error.code === "auth/wrong-password") {
        console.error("Incorrect password.");
      } else if (error.code === "auth/invalid-email") {
        console.error("Invalid email format.");
      } else if (error.code === "auth/email-already-in-use") {
        console.error(
          "The new email address is already in use by another account."
        );
      } else {
        console.error("Unexpected error:", error.message);
      }
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
      <InputField
        data={formData.password}
        setData={(value) => handleChange("password", value)}
        error={formErrors.password}
        label={"Password"}
        placeholder={"Create a secure password"}
        type={"password"}
      />{" "}
      </div>
    </div>
  );

  const actions = [
    {
      label: "Authenticate",
      className:
        "border-2 text-sm border-black bg-black text-white hover:bg-white hover:text-black",
      onClick: ()=>handleReauthenticationAndEmailChange(),
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
