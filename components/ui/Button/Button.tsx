"use client";

import { ButtonProps } from "./ButtonProps";
import { BiLoaderAlt } from "react-icons/bi";

const Button: React.FC<ButtonProps> = ({
  buttonText,
  additionalStyles = "",
  onClick = () => {},
  buttonType = "black",
  isDisabled = false,
  type = "button",
  disabledLoader = true,
}) => {
  const baseStyles =
    "w-full h-12 font-semibold rounded-md transition-all duration-300";

  const blackButtonStyles =
    "border-none text-white bg-black hover:shadow-md hover:shadow-slate-400 disabled:bg-gray-400 disabled:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed";
  const transparentButtonStyles =
    "border-2 border-black hover:bg-black hover:text-white disabled:bg-gray-100 disabled:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed";

  const computedClassName = `${baseStyles} ${
    buttonType === "black" ? blackButtonStyles : transparentButtonStyles
  } ${additionalStyles}`;

  return (
    <button
      className={computedClassName}
      onClick={onClick}
      disabled={isDisabled}
      type={type}
    >
      {!isDisabled ? (
        buttonText
      ) : !disabledLoader ? (
        buttonText
      ) : (
        <BiLoaderAlt
          className="m-auto animate-spin"
          size="25"
          color={buttonType === "black" ? "white" : "gray"}
        />
      )}
    </button>
  );
};

export default Button;
