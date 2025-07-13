import React, { useState } from "react";

export default function Toolip({ children, text }) {
  const [show, setShow] = useState(false)

  return (
    <div className="group relative flex-1 min-w-[200px] w-[200px] md:w-auto md:max-w-none">
      <div
        className={`absolute hidden group-hover:flex left-1/2 -translate-x-1/2 mx-auto -top-12`}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        <span className={`relative text-center text-nowrap z-10 text-xs leading-none py-2 px-3 font-semibold text-white whitespace-no-wrap bg-black shadow-lg rounded-md`}>
          {text}
        </span>
      </div>
      {children}
    </div>
  );
}
