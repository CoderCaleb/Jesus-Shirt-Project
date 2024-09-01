import React from "react";
import { useSearchParams } from "react-router-dom";
import VerificationPage from "./VerificationPage";

export default function EmailChangeVerification() {
  const [searchParams] = useSearchParams();
  const newEmail = searchParams.get("newEmail");
  return (
    <VerificationPage
      email={newEmail}
      navigatedFrom={"change-email"}
      titleComponent={<TitleComponent />}
      descriptionComponent={<DescriptionComponent email={newEmail} />}
    />
  );
}

const TitleComponent = () => (
  <p className="text-3xl font-semibold">Verify new email</p>
);

const DescriptionComponent = ({ email }) => (
  <p className="text-sm text-slate-600 font-semibold">
    We have received your request to change your email address. Please check
    your inbox for a confirmation email sent to{" "}
    <span className="text-blue-600">{email}</span> to verify your new email.
  </p>
);
