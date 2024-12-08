import React from "react";
import SignUpClient from "@/components/features/signin/SignUpClient";
import DisplayPromptFromState from "@/components/features/auth/DisplayPromptFromState";

interface SearchParams {
  from: string | undefined;
  state: string | undefined;
  orderId: string | undefined;
  orderToken: string | undefined;
  email: string | undefined;
  linkedUserEmail: string | undefined;
}

const page = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
  const searchParamsObject = { ...(await searchParams) };
  const { from, state, orderId, orderToken, email, linkedUserEmail } =
    searchParamsObject;
  return (
    <div className="w-full h-full justify-center items-center flex">
      <div className="w-96 flex flex-col text-center">
        <p className="text-3xl font-semibold mb-3">Get Started!</p>
        <div className="">
          {from === "order-tracking" && state ? (
            <DisplayPromptFromState
              state={state}
              linkedUserEmail={linkedUserEmail}
            />
          ) : from === "sign-up" || from === "change-email" ? (
            <p className="text-sm text-slate-700 font-semibold">{`Email verification successful. Please sign in to ${email} to proceed`}</p>
          ) : (
            <></>
          )}
        </div>
        <div className="bg-slate-300 w-full h-lineBreakHeight my-4" />
        <SignUpClient orderToken={orderToken} state={state} orderId={orderId} />
      </div>
    </div>
  );
};

export default page;
