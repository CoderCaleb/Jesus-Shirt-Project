import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import {
  clearLoginAttemptInfo,
  consumeCode,
  createCode,
} from "supertokens-web-js/recipe/passwordless";

import Session from "supertokens-web-js/recipe/session";
import { handleAddingUser } from "./generalHelpers";

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
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  orderToken?: string,
  orderNumber?: string,
  state?: string,
) => {
  setStatus("loading");

  try {
    const response: MagicLinkResponse = await consumeCode({
      options: {
        preAPIHook: async (input) => {
          let { url, requestInit } = input;
          const existingBody = requestInit.body
            ? JSON.parse(requestInit.body as string)
            : {};
          if (orderToken) {
            requestInit = {
              ...requestInit,
              headers: {
                ...requestInit.headers,
                OrderToken: orderToken,
              },
              body: JSON.stringify({
                ...existingBody,
                orderNumber: orderNumber,
                state: state,
              }),
            };
          }
          return { url, requestInit };
        },
      },
    });

    if (response.status === "OK") {
      // Clear login attempt info
      await clearLoginAttemptInfo();

      if (
        response.createdNewRecipeUser &&
        response.user?.loginMethods.length === 1
      ) {
        window.location.href = "/shop?authStatus=success&authType=signup";
      } else {
        window.location.href = "/shop?authStatus=success&authType=signin";
      }
    } else {
      setStatus("error");
      setErrorMessage(
        "Sorry, this link is either expired or invalid. Please try again.",
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
  return (await getLoginAttemptInfo()) !== undefined;
}

export async function doesSessionExist() {
  return await Session.doesSessionExist();
}
