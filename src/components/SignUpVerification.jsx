import React from "react";
import { useSearchParams } from "react-router-dom";
import VerificationPage from "./VerificationPage";

export default function SignUpVerification() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  return (
    <VerificationPage
      email={email}
      navigatedFrom={"sign-up"}
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
    Thank you for signing up! To complete your registration, please check your
    inbox for a confirmation email sent to{" "}
    <span className="text-blue-600">{email}</span>. Click the link in the email
    to verify your account.
  </p>
);
