import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import {
  clearLoginAttemptInfo,
  consumeCode,
  createCode,
} from "supertokens-web-js/recipe/passwordless";

export async function sendMagicLink(email: string) {
  try {
    let response = await createCode({
      email,
    });

    if (response.status === "SIGN_IN_UP_NOT_ALLOWED") {
      throw new Error(response.reason);
    }
  } catch (err: any) {
    if (err.isSuperTokensGeneralError === true || err.message) {
      throw new Error(err.message);
    } else {
      throw new Error("Oops! Something went wrong.");
    }
  }
}

import { getLoginAttemptInfo } from "supertokens-web-js/recipe/passwordless";

export async function hasInitialMagicLinkBeenSent() {
  return (await getLoginAttemptInfo()) !== undefined;
}

// utils/handleMagicLinkClicked.ts

type MagicLinkResponse = {
  status: string;
  createdNewRecipeUser?: boolean;
  user?: { loginMethods: any[] };
};

export const handleMagicLinkClicked = async (
  router: AppRouterInstance,
  setStatus: React.Dispatch<
    React.SetStateAction<"loading" | "error" | "success" | "idle">
  >,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>
) => {
  setStatus("loading");

  try {
    const response: MagicLinkResponse = await consumeCode();

    if (response.status === "OK") {
      // Clear login attempt info
      await clearLoginAttemptInfo();

      if (
        response.createdNewRecipeUser &&
        response.user?.loginMethods.length === 1
      ) {
        // user sign up success
        router.push("/shop?authStatus=success&authType=signup");
      } else {
        // user sign in success
        router.push("/shop?authStatus=success&authType=signin");
      }
    } else {
      setStatus("error");
      setErrorMessage(
        "Sorry, this link is either expired or invalid. Please try again."
      );
    }
  } catch (err: any) {
    setStatus("error");
    if (err.isSuperTokensGeneralError) {
      setErrorMessage(`Error: ${err.message}`);
    } else {
      setErrorMessage("Oops! Something went wrong. Please try again later.");
    }
    console.error("Error verifying magic link:", err);
  }
};

export async function isThisSameBrowserAndDevice() {
    return await getLoginAttemptInfo() !== undefined;
}

import Session from 'supertokens-web-js/recipe/session';

export async function doesSessionExist() {
    return await Session.doesSessionExist()
}