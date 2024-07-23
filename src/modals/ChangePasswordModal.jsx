// components/RemoveItemModal.js
import React, { useContext, useState } from "react";
import { RiLockPasswordLine } from "react-icons/ri";
import { StateSharingContext } from "../contexts";
import {
  getAuth,
  sendPasswordResetEmail,
} from "firebase/auth";
import Modal from "./Modal";
import { toast } from "react-toastify";

export default function ChangePasswordModal({}) {
  const { showChangePasswordModal, setShowChangePasswordModal } =
    useContext(StateSharingContext);

  async function handleChangePassword(email) {
    const auth = getAuth()
    try {
      await sendPasswordResetEmail(auth, email);
      console.log("Password reset email sent!");
      toast.success(`Password reset email sent to ${email}!`);
    } catch (error) {
      console.error("Error sending password reset email:", error);
      toast.error("Error sending password reset email");
    }
    finally {
        setShowChangePasswordModal({state:false})
    }
  }

  const handleCloseModal = () => {
    setShowChangePasswordModal({ state: false });
  };

  const title = (
    <div className="flex items-center gap-2">
      <RiLockPasswordLine size={30} />{" "}
      <p className="text-xl font-bold">Change password</p>
    </div>
  );

  const content = (
    <div>
      <p className="text-sm text-slate-600 text-center">
        {`A password reset email will be sent to ${
          getAuth().currentUser.email
        }`}
      </p>
    </div>
  );

  const actions = [
    {
      label: "Send",
      className:
        "border-2 text-sm border-black bg-black text-white hover:bg-white hover:text-black",
      onClick: ()=>handleChangePassword(getAuth().currentUser.email),
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
      open={showChangePasswordModal.state}
    />
  );
}
