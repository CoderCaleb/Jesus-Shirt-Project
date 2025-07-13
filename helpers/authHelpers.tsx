import {
  clearLoginAttemptInfo,
  consumeCode,
  createCode,
} from "supertokens-web-js/recipe/passwordless";

import Session from "supertokens-web-js/recipe/session";

type preApiHookInputType = {
  url: string;
  requestInit: RequestInit;
  userContext: unknown;
}

function attachOrderHeaders(
  input: preApiHookInputType,
  orderToken?: string,
  orderNumber?: string,
  state?: string,
) {
  let { url, requestInit } = input;
  console.log("Attach headers", orderToken, orderNumber, state);
  if (orderToken && orderNumber && state) {
    requestInit = {
      ...requestInit,
      headers: {
        ...requestInit.headers,
        "Order-Token": orderToken,
        orderNumber: orderNumber,
        state: state,
      },
    };
  }
  return { url, requestInit };
}

export async function sendMagicLink(
  email: string,
  orderToken?: string,
  orderNumber?: string,
  state?: string,
) {
  try {
    const response = await createCode({
      email,
      options: {
        preAPIHook: async (input) => {
          return attachOrderHeaders(input, orderToken, orderNumber, state);
        },
      },
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
          return attachOrderHeaders(input, orderToken, orderNumber, state);
        },
      },
    });
    console.log("Magic link response:", response);
    await clearLoginAttemptInfo();

    if (response.status === "OK") {
      // Clear login attempt info

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
    console.log("Magic link error", err);
    setStatus("error");
    if (err.isSuperTokensGeneralError) {
      setErrorMessage(`${err.message}`);
    } else {
      setErrorMessage(
        err.message || "Oops! Something went wrong. Please try again later.",
      );
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
