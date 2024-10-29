import React from 'react';

const DisplayPromptFromState = ({ state, linkedUserEmail, orderId }) => {
  const style = " text-sm text-slate-700 font-semibold";
  const messages = {
    "authenticated-order-not-in-user-linked-user-not-matched": `Please log in to the account associated with this order: ${linkedUserEmail}`,
    "not-authenticated-has-linked-user": `Please log in to the account associated with this order: ${linkedUserEmail}`,
    "not-authenticated-no-linked-user": `Log in to connect order ${orderId || ""} to your existing account.`,
    "authenticated-no-linked-user": `Log in to connect order ${orderId || ""} to your existing account.`,
    "authenticated-failed-no-order-token": `Login to view your order.`,
    "authenticated-order-token-invalid": `Login to view your order.`,
  };

  return messages[state] ? <p className={style}>{messages[state]}</p> : null;
};

export default DisplayPromptFromState;