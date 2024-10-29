import React, { useContext, useState } from "react";
import { RiLockPasswordLine } from "react-icons/ri";
import { StateSharingContext } from "../contexts";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import Modal from "./Modal";
import { toast } from "react-toastify";
import { sendVerificationEmail } from "../utils/helpers";
import { useNavigate } from "react-router";
import { MdOutlineMailLock } from "react-icons/md";
import { LuLoader2 } from "react-icons/lu";

export default function SendVerificationModal({}) {
  const { sendVerificationEmailModal, setSendVerificationEmailModal } =
    useContext(StateSharingContext);

  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate()
  if (!sendVerificationEmailModal?.email) {
    return null;
  }
  
  async function handleSendVerification(email) {
    setLoading(true);
    try {
      await sendVerificationEmail(email, "login");
      toast.success("Email verification sent successfully!");
      navigate(`/verification/login-verification?email=${email}`);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
      setSendVerificationEmailModal({state:false})
    }
  }

  const handleCloseModal = () => {
    setSendVerificationEmailModal({ state: false });
  };

  const title = (
    <div className="flex items-center gap-2">
      <MdOutlineMailLock size={30} />{" "}
      <p className="text-xl font-bold">Send verification email</p>
    </div>
  );

  const content = (
    <div>
      {!loading ? (
        <p className="text-sm text-slate-600 text-center">
          {`A verification email will be sent to ${sendVerificationEmailModal.email}`}
        </p>
      ) : (
        <LuLoader2
          className="m-auto animate-spin py-3"
          size={60}
          color="black"
        />
      )}
    </div>
  );

  const actions = [
    {
      label: "Send",
      className:
        "border-2 text-sm border-black bg-black text-white hover:bg-white hover:text-black",
      onClick: () => handleSendVerification(sendVerificationEmailModal.email),
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
      open={sendVerificationEmailModal.state}
    />
  );
}
