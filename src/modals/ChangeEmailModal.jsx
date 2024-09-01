import React, { useContext, useEffect, useState } from "react";
import { RiLockPasswordLine } from "react-icons/ri";
import { StateSharingContext } from "../contexts";
import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  signOut,
} from "firebase/auth";
import { useNavigate } from "react-router";
import { LuLoader2 } from "react-icons/lu";
import Modal from "./Modal";
import InputField from "../components/InputField";
import { handleFieldChange, validateFields } from "../utils/helpers";
import { toast } from "react-toastify";
import "../ScrollBar.css";

export default function ChangeEmailModal({}) {
  const [formData, setFormData] = useState({
    newEmail: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [toastStage, setToastStage] = useState("default");
  const [loading, setLoading] = useState(false);
  const [buttonCountdown, setButtonCountdown] = useState(8);
  const { showReauthenticateModal, setShowReauthenticateModal, userToken } =
    useContext(StateSharingContext);

  const handleChange = handleFieldChange(setFormData, setFormErrors);

  const navigate = useNavigate();

  const validateForm = () => {
    const fieldsToValidate = ["newEmail"];
    return validateFields(fieldsToValidate, setFormErrors, formData);
  };

  useEffect(() => {
    if (toastStage === "confirm-email") {
      setButtonCountdown(8)
      const interval = setInterval(() => {
        setButtonCountdown((prev) => {
          if (prev > 0) {
            return prev - 1;
          } else {
            clearInterval(interval);
            return 0;
          }
        });
      }, 1000); // Countdown every 1 second (1000 milliseconds)

      // Cleanup function to clear interval on unmount or when toastStage changes
      return () => clearInterval(interval);
    }
  }, [toastStage]);

  const handleEmailChange = async (newEmail) => {
    if (!userToken) {
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
      setLoading(true);

      const response = await fetch("http://127.0.0.1:4242/update-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ newEmail: newEmail, uid: user.uid }),
      });

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.error || "Failed to update email");
      }
      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      await signOut(auth);

      console.log("Email updated successfully.");
      toast.success("Email updated successfully. Please verify your new email");
      navigate(`/verification/email-change-verification?newEmail=${newEmail}`);
      setToastStage("complete");
    } catch (error) {
      console.error("Error during reauthentication or email update:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowReauthenticateModal({ state: false });
    setToastStage("default");
  };

  const title = (
    <div className="flex items-center gap-2">
      <RiLockPasswordLine size={30} />{" "}
      <p className="text-xl font-bold">Change email</p>
    </div>
  );

  const generateContent = () => {
    if (toastStage === "default") {
      return !loading ? (
        <div>
          <p className="text-sm text-slate-600 font-semibold">
            Please enter your new email to change.
          </p>
          <div className="flex flex-col gap-5 mt-3 mb-2">
            <InputField
              data={formData.newEmail}
              setData={(value) => handleChange("newEmail", value)}
              error={formErrors.newEmail}
              label={"New email"}
              placeholder={"Create a new email"}
              type={"email"}
            />
          </div>
        </div>
      ) : (
        <div>
          <LuLoader2
            className="m-auto animate-spin py-3"
            size={60}
            color="black"
          />
        </div>
      );
    }

    if (toastStage === "confirm-email") {
      return (
        <div>
          <p className="text-sm text-slate-600 font-semibold">
            Please confirm that you entered your new email correctly as a
            verification email will be sent to the new email.
          </p>
          <div className="flex flex-col gap-5 mt-5 mb-4 p-5 bg-slate-100 shadow-md shadow-slate-200 rounded-md">
            <div className="overflow-x-scroll w-full h-full scroll-container">
              <p className="font-semibold text-2xl text-center">{formData.newEmail}</p>
            </div>
          </div>
        </div>
      );
    }

    if (toastStage === "complete") {
      return (
        <div>
          <p className="text-sm text-slate-600 font-semibold">
            Email change success! A verification email has been sent to your new
            email.
          </p>
        </div>
      );
    }

    return null; // Fallback in case no stages match
  };

  const actions = [
    // Conditionally add this object based on toastStage
    toastStage === "default" && {
      label: "Done",
      className: `border-2 text-sm ${"border-black bg-black text-white hover:bg-white hover:text-black"}`,
      onClick: () => {
        if (validateForm()) {
          setToastStage("confirm-email");
        }
      },
    },
    toastStage === "confirm-email" && {
      label: `Confirm ${
        buttonCountdown > 0 ? "(" + buttonCountdown + ")" : ""
      }`,
      className: `border-2 text-sm ${"border-black bg-black text-white hover:bg-white hover:text-black disabled:border-[#E5E5E5] disabled:bg-[#E5E5E5] disabled:text-gray-500 disabled:cursor-not-allowed"}`,
      disabled: buttonCountdown > 0 || loading,
      onClick: () =>
        !loading || !buttonCountdown > 0
          ? handleEmailChange(formData.newEmail)
          : () => {},
    },
    toastStage === "complete" && false,
    {
      label: "Cancel",
      className:
        toastStage === "complete"
          ? "border-2 text-sm border-black bg-black text-white hover:bg-white hover:text-black"
          : "border-2 border-gray-300",
      onClick: handleCloseModal,
    },
  ].filter(Boolean); // Filter out `false` values

  return (
    <Modal
      title={title}
      content={generateContent()}
      actions={actions}
      open={showReauthenticateModal.state}
    />
  );
}
