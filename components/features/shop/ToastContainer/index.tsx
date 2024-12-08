"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
const ToastNotification = () => {
  const searchParams = useSearchParams();
  const authStatus = searchParams.get("authStatus");
  const authType = searchParams.get("authType");

  useEffect(() => {
    // Check if there are query params indicating success and authType
    if (authStatus === "success") {
      if (authType === "signup") {
        toast.success("Sign up successful! Welcome aboard!");
      } else if (authType === "signin") {
        toast.success("Sign in successful! Welcome back!");
      }
    }
  });

  return null; // This component doesn't need to render anything itself
};

export default ToastNotification;
