import React from "react";

interface OrderPromptProps {
  state: string;
  linkedUserEmail?: string;
}

const DisplayPromptFromState: React.FC<OrderPromptProps> = ({
  state,
  linkedUserEmail = "",
}) => {
  const style = "text-sm text-slate-700 font-semibold";

  switch (state) {
    case "token_invalid_linked_user":
      return (
        <p className={style}>
          Login to the account linked with this order to view it.
        </p>
      );

    case "token_invalid_no_linked_user":
      return (
        <p className={style}>
          Your order token is missing or invalid. Resend the order link to your
          registered email.
        </p>
      );

    case "valid_token_unauthenticated_linked_user":
      return (
        <p className={style}>
          Login to the account linked with this order ({linkedUserEmail}) to
          view it.
        </p>
      );

    case "valid_token_unauthenticated_no_linked_user":
      return (
        <p className={style}>
          Sign up or login to connect this order to your account.
        </p>
      );

    case "valid_token_authenticated_order_error":
      return (
        <p className={style}>
          This order is linked to another account ({linkedUserEmail}). Please
          log in with the correct account.
        </p>
      );

    case "valid_token_authenticated_no_order_error":
      return <p className={style}>Your order details are available to view.</p>;

    case "valid_token_authenticated_no_linked_user":
      return (
        <p className={style}>Connect this order to your account to view it.</p>
      );

    default:
      return (
        <p className={style}>An unknown error occurred. Please try again.</p>
      );
  }
};
export default DisplayPromptFromState;
