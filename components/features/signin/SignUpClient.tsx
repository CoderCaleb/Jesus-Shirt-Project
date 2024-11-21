"use client";
import InputField from "@/components/ui/InputField";
import MessageBox from "@/components/ui/MessageBox";
import Link from "next/link";
import React, { useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/Button";
import { sendMagicLink } from "@/helpers/authHelpers";
import { toast } from "react-toastify";

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
  const [sendMagicLinkLoading, setSendMagicLinkLoading] = useState(false)
  const [sendMagicLinkError, setSendMagicLinkError] = useState({error:null})

  const onSubmit = async (data: FormData) => {
    setSendMagicLinkLoading(true)
    try{
        await sendMagicLink(data.email)
        toast.success("Check your inbox for the magic link! 😊 We're excited to have you onboard.")
    }
    catch(error:any){
        setSendMagicLinkError({error:error.message})
    }
    finally{
        setSendMagicLinkLoading(false)
    }
  };

  return (
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
          <p className="mt-5 text-sm text-slate-800 font-semibold">
            Don't have an account yet?{" "}
            <Link
              href={
                from === "order-tracking" &&
                (state === "not-authenticated-no-linked-user" ||
                  state === "authenticated-no-linked-user")
                  ? `/signup?from=order-tracking&state=${state}&orderId=${orderId}&orderToken=${orderToken}`
                  : "/signup"
              }
            >
              <span className="cursor-pointer text-blue-600 mt-5">
                Sign up now
              </span>
            </Link>
          </p>
          {sendMagicLinkError.error && (
            <MessageBox
              type="error"
              message={sendMagicLinkError?.error}
            />
          )}
        </div>
      </form>
    </FormProvider>
  );
}
