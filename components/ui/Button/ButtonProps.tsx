export type ButtonProps = {
  buttonText: string;
  additionalStyles?: string;
  onClick?: () => void;
  buttonType?: "black" | "transparent";
  isDisabled?: boolean;
  type?: "button" | "submit" | "reset";
  disabledLoader?: boolean
};
