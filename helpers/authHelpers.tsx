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
  role?: string,
) {
  let { url, requestInit } = input;
  console.log("Attach headers", orderToken, orderNumber, state, role);
  const headers : Record<string, any> = {...requestInit.headers}
  
  if (orderToken) headers["Order-Token"] = orderToken;
  if (orderNumber) headers["orderNumber"] = orderNumber;
  if (state) headers["state"] = state;
  if (role) headers["role"] = role; 
  if(headers){
    console.log("headers",headers)
  }
  
    requestInit = {
      ...requestInit,
      headers
    };
  
  return { url, requestInit };
}

export async function sendMagicLink(
  role: string,
  email: string,
  orderToken?: string,
  orderNumber?: string,
  state?: string,
) {
  try {
    console.log("role",role)
    if(!role){
      throw new Error("No role provided")
    }
    const response = await createCode({
      email,
      options: {
        preAPIHook: async (input) => {
          return attachOrderHeaders(input, orderToken, orderNumber, state, role);
        },
      },
    });

    console.log("create code response",response)
  

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
  role: string,
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
          return attachOrderHeaders(input, orderToken, orderNumber, state, role);
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
