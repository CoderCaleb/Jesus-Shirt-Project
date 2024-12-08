"use client";
import React from "react";
import SuperTokensWebJs from "supertokens-web-js";
import { frontendConfig } from "@/config/frontend";

if (typeof window !== "undefined") {
  // we only want to call this init function on the frontend, so we check typeof window !== 'undefined'
  SuperTokensWebJs.init(frontendConfig());
}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const SuperTokensInit: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  return <>{children}</>;
};
