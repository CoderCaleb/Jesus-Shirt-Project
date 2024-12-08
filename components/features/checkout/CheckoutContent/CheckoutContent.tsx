import { CartData } from "@/types/product";
import { useState } from "react";
import CheckoutShipping from "./CheckoutShipping";
import OrderSummaryPanel from "./OrderSummaryPanel";
import CheckoutPayment from "./CheckoutPayment";
const CheckoutContent = ({
  checkoutItems,
  paymentIntentId,
}: {
  checkoutItems: CartData[];
  paymentIntentId: string;
}) => {
  const [checkoutProgress, setCheckoutProgress] = useState(1);
  return (
    <>
      {checkoutProgress === 1 ? (
        <CheckoutShipping
          checkoutItems={checkoutItems}
          checkoutProgress={checkoutProgress}
          setCheckoutProgress={setCheckoutProgress}
          paymentIntentId={paymentIntentId}
        />
      ) : checkoutProgress === 2 ? (
        <CheckoutPayment
          checkoutItems={checkoutItems}
          checkoutProgress={checkoutProgress}
          setCheckoutProgress={setCheckoutProgress}
        />
      ) : (
        <></>
      )}
      <OrderSummaryPanel checkoutItems={checkoutItems} shippingPrice={2} />
    </>
  );
};

export default CheckoutContent;
