type ButtonProps = {
    buttonText: string;
    additionalStyles?: string;
    onClick: () => void;
    buttonType?: "black" | "transparent";
  };
  
  const Button: React.FC<ButtonProps> = ({
    buttonText,
    additionalStyles = "",
    onClick,
    buttonType = "black",
  }) => {
    const baseStyles = "w-full h-12 font-semibold rounded-md";
    const blackButtonStyles = "border-2 border-none text-white bg-black hover:shadow-xl shadow-indigo-800";
    const transparentButtonStyles = "border-2 border-black hover:bg-black hover:text-white";
  
    const computedClassName =
      buttonType === "black" ? blackButtonStyles : transparentButtonStyles;
  
    return (
      <button
        className={`${baseStyles} ${computedClassName} ${additionalStyles}`}
        onClick={onClick}
      >
        {buttonText}
      </button>
    );
  };
  
  export default Button;
  