import React from "react";
import { useSearchParams } from "react-router-dom";
import VerificationPage from "./VerificationPage";

export default function LoginVerification() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  return (
    <VerificationPage
      email={email}
      navigatedFrom={"login"}
      titleComponent={<TitleComponent />}
      descriptionComponent={<DescriptionComponent email={email} />}
    />
  );
}
const TitleComponent = () => (
  <p className="text-3xl font-semibold">Verify your email</p>
);

const DescriptionComponent = ({ email }) => (
  <p className="text-sm text-slate-600 font-semibold">
    It looks like your email hasn't been verified yet. Please check your inbox
    for a verification email sent to{" "}
    <span className="text-blue-600">{email}</span>.
  </p>
);
