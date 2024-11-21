import React from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useFormContext } from "react-hook-form"; // Get the context of RHF
import { z } from "zod"; // Import Zod

interface InputFieldProps {
  Icon?: React.ReactNode;
  name: string; // Add name to associate input with RHF
  label: string;
  placeholder: string;
  type?: "text" | "password" | "info" | "dropdown";
  dropdownFunc?: () => void;
  additionalStyles?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  Icon,
  name,
  label,
  placeholder,
  type = "text",
  dropdownFunc,
  additionalStyles = "",
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext(); // Get register and errors from RHF context

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
        {Icon && Icon}
        <input
          {...register(name)} // Register input field with RHF
          placeholder={placeholder}
          className={`bg-transparent h-full outline-none flex-1 ${
            type === "info" ? "cursor-not-allowed" : ""
          }`}
          type={type}
          readOnly={type === "dropdown" || type === "info"}
        />
        {type === "dropdown" && dropdownFunc && (
          <RiArrowDropDownLine
            size={30}
            color={"black"}
            className="cursor-pointer"
            onClick={dropdownFunc}
          />
        )}
      </div>
      {errors[name] && (
        <p className="text-sm text-red-600">
          <>{errors[name]?.message}</>
        </p> // Show error message if any
      )}
    </div>
  );
};

export default InputField;
