import React from 'react';

interface DisplayPromptFromStateProps {
  state?: string;
  linkedUserEmail?: string;
  orderId?: string;
}


const DisplayPromptFromState: React.FC<DisplayPromptFromStateProps> = ({
  state,
  linkedUserEmail,
  orderId,
}) => {
  const style = "text-sm text-slate-700 font-semibold";
  if(!state||!linkedUserEmail){
    return <></>
  }

  const messages: { [key: string]: string } = {
    "authenticated-order-not-in-user-linked-user-not-matched": `Please log in to the account associated with this order: ${linkedUserEmail}`,
    "not-authenticated-has-linked-user": `Please log in to the account associated with this order: ${linkedUserEmail}`,
    "not-authenticated-no-linked-user": `Log in to connect order ${orderId || ""} to your existing account.`,
    "authenticated-no-linked-user": `Log in to connect order ${orderId || ""} to your existing account.`,
    "authenticated-failed-no-order-token": `Login to the account linked with this order to view your order.`,
    "authenticated-order-token-invalid": `Login to view your order.`,
  };

  return messages[state] ? <p className={style}>{messages[state]}</p> : null;
};

export default DisplayPromptFromState;

//for ordertoken verified

  //for linkeduser
  //when its "noordererror-usererror-haslinkeduser-ordertoken" (not possible since when usererror, there will be ordererror)
  //when its "noordererror-nousererror-haslinkeduser-ordertoken" then its success already
  //when its "ordererror-nousererror-haslinkeduser-ordertoken" then "Please log in to the account associated with this order: ${linkedUserEmail}"
  //when its "ordererror-usererror-haslinkeduser-ordertoken" then "Please log in to the account associated with this order: ${linkedUserEmail}"

  //for nolinkeduser
  //when its "ordererror-usererror-nolinkeduser-ordertoken" then "Log in to connect order ${orderId || ""} to your existing account."
  //when its "ordererror-nousererror-nolinkeduser-ordertoken" then "Log in to connect order ${orderId || ""} to your existing account."
  //when its "noordererror-usererror-nolinkeduser-ordertoken" (not possible since when usererror, there will be ordererror)
  //when its "noordererror-nousererror-nolinkeduser-ordertoken" (not possible since nolinkeduser means theres ordererror)

  //for ordertoken invalid or not provided

  //for linkeduser
  //when its "ordererror-nousererror-haslinkeduser-noordertoken" then "Login to the account linked with this order to view your order."
  //when its "ordererror-usererror-haslinkeduser-noordertoken" then "Login to the account linked with this order to view your order."

  //for nolinkeduser
  //when its "ordererror-usererror-nolinkeduser-noordertoken" then "Need order token to connect order to a existing account"
  //when its "ordererror-nousererror-nolinkeduser-noordertoken" then "Need order token to connect order to a existing account"