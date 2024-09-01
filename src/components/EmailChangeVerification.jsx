import React from "react";
import { useSearchParams } from "react-router-dom";
import VerificationPage from "./VerificationPage";

export default function EmailChangeVerification() {
  const [searchParams] = useSearchParams()
  const newEmail = searchParams.get("newEmail")
  return(
    <VerificationPage email={newEmail} navigatedFrom={"change-email"}/>
  )
}
