import React, { useState, useContext, useEffect } from "react";

export default function MessageBox({ type, message }) {
    const unsuccessfulStyle =
      "w-full py-3 font-semibold rounded-lg border-l-[6px] text-left text-sm px-5 bg-red-50 border-l-red-700 border-red-300 border-1 justify-center items-center flex gap-3 mt-5";
    const successfulStyle =
      "w-full py-3 font-semibold rounded-lg border-l-[6px] text-left text-sm px-5 bg-green-50 border-l-green-700 border-green-300 border-1 justify-center items-center flex gap-3 mt-5";
  
    return (
      <div className={type === "success" ? successfulStyle : unsuccessfulStyle}>
        <p>{message}</p>
      </div>
    );
}