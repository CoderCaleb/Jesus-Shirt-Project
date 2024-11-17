import { calculatePrices } from "@/helpers/generalHelpers";
import { CartData } from "@/types/product";
import { useEffect, useState } from "react";
import CheckoutShipping from "./CheckoutShipping";
import OrderSummaryPanel from "./OrderSummaryPanel";
import CheckoutPayment from "./CheckoutPayment/CheckoutPayment";
const CheckoutContent = ({ checkoutItems, paymentIntentId }: { checkoutItems: CartData[], paymentIntentId:string }) => {
  const [checkoutProgress, setCheckoutProgress] = useState(1);
  const [prices, setPrices] = useState({
    productPrice: 0,
    totalPrice: 0,
    shippingPrice: 0,
  });
  useEffect(() => {
    setPrices(calculatePrices(checkoutItems, 2));
  }, [checkoutItems, calculatePrices]);
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
