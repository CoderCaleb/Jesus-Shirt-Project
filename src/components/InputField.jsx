import React from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
export default function InputField({
  Icon,
  setData,
  data,
  setError,
  error,
  label,
  placeholder,
  type,
  dropdownFunc,
}) {
  return (
    <div className="">
      <p className="font-sans text-[14px] mb-2">{label}</p>
      <div className="flex px-3 gap-2 bg-[#FFFFFF] items-center justify-between py-3 w-full min-h-[2.5rem] h-11 bg-transparent border-2 border-slate-300 outline-black rounded-[10px] text-sm font-semibold">
        {Icon}
        <input
          placeholder={placeholder}
          className="bg-transparent h-full outline-none flex-1"
          onChange={(e) => {
            if (setData) {
              setData(e.target.value);
            }
            setError("");
          }}
          value={data}
          type={type}
          readOnly={type==="dropdown"}
        />
        {type === "dropdown" ? (
          <RiArrowDropDownLine
            size={30}
            color={"black"}
            className="cursor-pointer"
            onClick={() => {
              dropdownFunc();
            }}
          />
        ) : (
          <></>
        )}
      </div>
      <p
        className={`text-sm text-red-600 ${error === "" ? "hidden" : "block"}`}
      >
        {error}
      </p>
    </div>
  );
}
