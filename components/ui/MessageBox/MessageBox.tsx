import React from "react";

interface MessageBoxProps {
  type: "success" | "error";
  message: string;
  clickableText?: React.ReactNode;
}

export default function MessageBox({ type, message, clickableText }: MessageBoxProps) {
  const unsuccessfulStyle =
    "w-full py-3 font-semibold rounded-lg border-l-[6px] text-left text-sm px-5 bg-red-50 border-l-red-700 border-red-300 border-1 justify-center items-center text-center flex mt-5 gap-1";

  const successfulStyle =
    "w-full py-3 font-semibold rounded-lg border-l-[6px] text-left text-sm px-5 bg-green-50 border-l-green-700 border-green-300 border-1 justify-center items-center text-center flex mt-5 gap-1";

  return (
    <div className={type === "success" ? successfulStyle : unsuccessfulStyle}>
      <span>{message}</span>
      {clickableText}
    </div>
  );
}
