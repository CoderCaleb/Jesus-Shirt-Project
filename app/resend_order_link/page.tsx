"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaRegCircleCheck } from "react-icons/fa6";
import { toast } from "react-toastify";
import { sendOrderLink } from "@/helpers/generalHelpers";
import TitleText from "@/components/ui/TitleText";
import SubText from "@/components/ui/SubText";
import Button from "@/components/ui/Button";
import { useSearchParams } from "next/navigation";
import InputField from "@/components/ui/InputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import Image from "next/image";
import { z } from "zod";

const emailSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),
});

type FormData = {
  email: string;
};
const ResendOrderLinkPage: React.FC = () => {
  const methods = useForm<FormData>({ resolver: zodResolver(emailSchema) });

  const [buttonCountdown, setButtonCountdown] = useState<number>(3);
  const [loading, setLoading] = useState<boolean>(false)
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [resendEmailPage, setResendSendEmailPage] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null); 

  // Countdown timer logic
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setButtonCountdown((prev) => (prev > 0 ? prev - 1 : prev));
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, []);

const handleResendOrderLink = async (data: FormData) => {
  setLoading(true);
  const { email } = data;

  try {
    // Reset countdown
    setButtonCountdown(50);

    // Clear existing interval if any
    if (intervalRef.current) clearInterval(intervalRef.current);

    // Start new interval
    intervalRef.current = setInterval(() => {
      setButtonCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!); // Clear interval when countdown ends
          intervalRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    await sendOrderLink(email, orderId as string);
    toast.success("Order link sent successfully!");
  } catch (error: any) {
    console.error("ERROR DATA", error.data);
    toast.error(
      error.data?.error || "Failed to resend order link. Please try again."
    );
  } finally {
    setLoading(false);
  }
};


  // Validate required props
  if (!orderId) {
    return (
      <div className="flex w-full h-full justify-center items-center">
        <p>No order number provided. Please check your input.</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center w-1/2 max-w-[450px] min-w-[300px] m-auto h-full">

      {!resendEmailPage ? (
        <div className={"text-center flex flex-col justify-center items-center gap-5"}>
          <div className="w-5/6 aspect-square relative">
            <Image
              src="/images/Transaction-Error.png"
              fill
              alt="transaction error"
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 35vw, 50vw"
            />
          </div>
          <TitleText
            text="That link doesn’t seem to work"
            additionalStyles="!font-semibold"
          />
          <SubText text="Sorry, this link is either expired or invalid. Please try again." />
          <Button
            buttonText="Get a new link"
            buttonType="black"
            additionalStyles="w-40"
            onClick={() => {
              setResendSendEmailPage(true)
            }}
          />
        </div>
      ) : (
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(handleResendOrderLink)}
            className="w-full h-full flex m-auto justify-center items-center"
          >
            <div className="w-96 m-auto flex flex-col justify-center text-center items-center gap-4 p-5 rounded-lg shadow-lg shadow-slate-200">
              {/* Static Header */}
              <FaRegCircleCheck size={45} className="fill-green-500" />
              <TitleText text="Resend order link" />
              <SubText text="Enter the email used during checkout. This must be the same email you provided when placing the order." />
  
              {/* Input Field */}
              <div className="flex flex-col gap-3 text-left w-full">
                <InputField
                  name="email"
                  label="Email Address"
                  placeholder="Enter your email"
                />
              </div>
  
              {/* Resend Button */}
              <Button
                isDisabled={loading || buttonCountdown > 0}
                buttonText={`Resend Order Link ${
                  buttonCountdown > 0 ? `(${buttonCountdown})` : ""
                }`}
                disabledLoader={loading}
                type="submit"
              />
  
              {/* Separator */}
              <div className="bg-slate-300 w-full h-[1px] my-4" />
  
              {/* Email and Steps */}
              <div className="flex flex-col gap-3">
                <div>
                  <p className="font-semibold">Next Steps:</p>
                  <ul className="text-sm font-semibold text-slate-600 list-disc list-inside">
                    <li>Check your inbox for the order link email.</li>
                    <li>
                      Click the link to link your order and view its details.
                    </li>
                    <li>
                      Once linked, you can access order tracking from your
                      account.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      )}
    </div>
  );
  
};

export default ResendOrderLinkPage;
