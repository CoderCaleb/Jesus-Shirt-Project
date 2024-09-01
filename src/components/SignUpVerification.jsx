import React from "react";
import { useSearchParams } from "react-router-dom";
import VerificationPage from "./VerificationPage";

export default function SignUpVerification() {
  const [searchParams] = useSearchParams()
  const newEmail = searchParams.get("email")
  return(
    <VerificationPage email={newEmail} navigatedFrom={"sign-up"}/>
  )
}
