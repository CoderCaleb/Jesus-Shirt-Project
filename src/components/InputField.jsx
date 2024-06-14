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
}) {
  const handleChange = (e) => {
    if (setData) {
      setData(e.target.value);
    }
  };

  return (
    <div>
      <label className="font-sans text-[14px] mb-2 block">
        {label}
      </label>
      <div className="flex px-3 gap-2 bg-[#FFFFFF] items-center justify-between py-3 w-full min-h-[2.5rem] h-11 bg-transparent border-2 border-slate-300 outline-black rounded-[10px] text-sm font-semibold">
        {Icon}
        <input
          placeholder={placeholder}
          className="bg-transparent h-full outline-none flex-1"
          onChange={handleChange}
          value={data}
          type={type}
          readOnly={type === "dropdown"}
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
      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
