"use client";
import InputField from "@/components/ui/InputField";
import MessageBox from "@/components/ui/MessageBox";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/Button";
import {
  hasInitialMagicLinkBeenSent,
  sendMagicLink,
} from "@/helpers/authHelpers";
import { toast } from "react-toastify";
import Loader from "@/components/ui/Loader";

interface SignUpClientProps {
  from: string | undefined;
  state: string | undefined;
  orderId: string | undefined;
  orderToken: string | undefined;
  email: string | undefined;
  linkedUserEmail: string | undefined;
}

type FormData = {
  email: string;
};

const emailSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),
});

export default function SignUpClient({
  from,
  state,
  orderId,
  orderToken,
  email,
  linkedUserEmail,
}: SignUpClientProps) {
  const methods = useForm<FormData>({ resolver: zodResolver(emailSchema) });
  const [sendMagicLinkLoading, setSendMagicLinkLoading] = useState(false);
  const [sendMagicLinkError, setSendMagicLinkError] = useState({ error: null });
  const [authStep, setAuthStep] = useState<null | number>(null);

  useEffect(() => {
    const updateInitialMagicLinkBeenSentState = async () => {
      setAuthStep((await hasInitialMagicLinkBeenSent()) ? 2 : 1);
    };
    updateInitialMagicLinkBeenSentState();
  }, []);

  const onSubmit = async (data: FormData) => {
    setSendMagicLinkLoading(true);
    try {
      await sendMagicLink(data.email);
      setAuthStep(2);
      methods.reset();
    } catch (error: any) {
      setSendMagicLinkError({ error: error.message });
    } finally {
      setSendMagicLinkLoading(false);
    }
  };

  if (!authStep) {
    return <Loader />;
  }

  return (
    <>
      {authStep === 1 ? (
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="w-full flex flex-col">
              <div className="flex flex-col gap-3 text-left">
                <InputField
                  name="email"
                  label="Email Address"
                  placeholder="Enter your email"
                />
              </div>
              <div className="pt-5">
                <Button
                  buttonText="Log in"
                  buttonType="black"
                  type="submit"
                  isDisabled={sendMagicLinkLoading}
                  additionalStyles="rounded-[10px]"
                />
              </div>
              {sendMagicLinkError.error && (
                <MessageBox type="error" message={sendMagicLinkError?.error} />
              )}
            </div>
          </form>
        </FormProvider>
      ) : (
        <>
          <MessageBox
            type="success"
            message={
              "We’ve sent you an email to sign in. Messages can take a few minutes to arrive in your inbox."
            }
          />
          <Button
            buttonText="Use a different email"
            buttonType="black"
            onClick={() => setAuthStep(1)}
            additionalStyles="mt-5"
          />
        </>
      )}
    </>
  );
}
