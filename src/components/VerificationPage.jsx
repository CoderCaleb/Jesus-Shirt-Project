import React, { useState, useEffect } from "react";
import { FaRegCircleCheck } from "react-icons/fa6";
import { LuMailOpen } from "react-icons/lu";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { sendVerificationEmail } from "../utils/helpers";
export default function VerificationPage({ email, navigatedFrom }) {
  const [buttonCountdown, setButtonCountdown] = useState(3);

  useEffect(() => {
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
  }, []);

  if (!email) {
    return (
      <div className="flex w-full h-full justify-center items-center">
        <p className="">No email provided</p>
      </div>
    );
  }

  const handleResendEmail = async () => {
    try {
      setButtonCountdown(50);
      
      await sendVerificationEmail(email, navigatedFrom)

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

      toast.success("Verification email sent successfully!");
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div className="w-full h-full justify-center items-center flex">
      <div className="w-96 flex flex-col text-center items-center gap-4 p-5 rounded-lg shadow-lg shadow-slate-200">
        <FaRegCircleCheck size={45} className=" fill-green-500" />
        <p className="text-3xl font-semibold">Verify new email</p>
        <p className=" text-sm text-slate-600 font-semibold">
          We have received your request to change your email address. Please
          check your inbox for a confirmation email sent to{" "}
          <span className="text-blue-600">{email}</span> to verify your new
          email.
        </p>
        <button
          className={`border-2 text-sm flex-1 px-3 py-2 font-semibold rounded-md ${"border-black bg-black text-white hover:bg-white hover:text-black disabled:border-[#E5E5E5] disabled:bg-[#E5E5E5] disabled:text-gray-500 disabled:cursor-not-allowed"}`}
          onClick={() => {
            handleResendEmail();
          }}
          disabled={buttonCountdown>0}
        >
          {`Resend email ${buttonCountdown > 0 ? "(" + buttonCountdown + ")" : ""}`}
        </button>
        <div className="bg-slate-300 w-full h-lineBreakHeight my-2" />
        <div>
          <div className="flex flex-row gap-2 justify-center items-center mb-2">
            <LuMailOpen size={20} />
            <p className="font-semibold">{`Current email:`}</p>
            <p className="text-sm font-semibold">{email}</p>
          </div>
          <div className="">
            <p className="font-semibold">Next Steps:</p>
            <div className="text-sm font-semibold text-slate-600">
              <p>1. Check your inbox for the confirmation email</p>
              <p>2. Click the link in the email to complete the change</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
