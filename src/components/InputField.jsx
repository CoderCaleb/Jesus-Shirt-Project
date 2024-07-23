import React from "react";
import { RiArrowDropDownLine } from "react-icons/ri";

export default function InputField({
  Icon,
  setData,
  data,
  error,
  label,
  placeholder,
  type,
  dropdownFunc,
  additionalStyles,
}) {
  const handleChange = (e) => {
    if (setData) {
      setData(e.target.value.trim());
    }
  };

  return (
    <div className={additionalStyles}>
      <label className="font-sans text-[14px] mb-2 block">{label}</label>
      <div
        className={`flex px-3 gap-2 items-center justify-between py-3 w-full min-h-[2.5rem] h-11 border-2 rounded-[10px] text-sm font-semibold ${
          type === "info"
            ? "bg-[#F0F0F0] text-[#9E9E9E] cursor-not-allowed border-gray-200"
            : "bg-white border-slate-300 outline-black"
        }`}
      >
        {" "}
        {Icon}
        <input
          placeholder={placeholder}
          className={`bg-transparent h-full outline-none flex-1 ${
            type === "info"
              ? "cursor-not-allowed"
              : ""
          }`}
          onChange={handleChange}
          value={data}
          type={type}
          readOnly={type === "dropdown" || type === "info"}
        />
        {type === "dropdown" && (
          <RiArrowDropDownLine
            size={30}
            color={"black"}
            className="cursor-pointer"
            onClick={dropdownFunc}
          />
        )}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
