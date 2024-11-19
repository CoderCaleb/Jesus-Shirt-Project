'use client';

import { useRouter } from "next/navigation";
import Button from "../Button";
import { ButtonProps } from "../Button/ButtonProps";

type ClientNavigationButtonProps = ButtonProps & {
  route: string;  // Route to navigate to when the button is clicked
};

const ClientNavigationButton: React.FC<ClientNavigationButtonProps> = ({
  route,
  ...buttonProps // Spread the rest of the props to pass to Button
}) => {
  const router = useRouter();

  const handleNavigation = () => {
    router.push(route); // Navigate to the route passed as prop
  };

  return (
    <Button
      {...buttonProps}  // Spread Button props like buttonText, additionalStyles, etc.
      onClick={handleNavigation}  // Override onClick to use navigation
    />
  );
};

export default ClientNavigationButton;
