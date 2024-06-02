import React, { useEffect, useContext, useState } from "react";
import { useLocation } from "react-router";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import CheckoutShipping from "./CheckoutShipping";
import CheckoutPayment from "./CheckoutPayment";
import OrderConfirmationPage from "./OrderComfirmation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import ItemCard from "./ItemCard";
import { CheckoutContext } from "../App";
import TransactionFailedError from "./TransactionFailedError";
import { HelperFunctionContext } from "../App";
const stripePromise = loadStripe(
  "pk_test_51OOBnGEvVCl2vla10CIfwh6ItUYeeZO4o3haVa9xFHyxwT6ekU8D8wAuA75GsRfGOhMLmU0Znf9dZKJPLNc5xrdq00PVRX8neU"
);

export default function Checkout() {
  const {
    checkoutProgress,
    clientSecret,
    isLoading,
    cartItems,
    setClientSecret,
    paymentIntentId,
    setPaymentIntentId,
  } = useContext(CheckoutContext);

  const { calculatePrices } = useContext(HelperFunctionContext);
  const [prices, setPrices] = useState({
    productPrice: 0,
    totalPrice: 0,
    shippingPrice: 0,
  });

  const location = useLocation();
  const { state } = location;
  let checkoutItems;

  if (state) {
    checkoutItems = state.checkoutItems;
  }
  useEffect(() => {
    setPrices(calculatePrices(checkoutItems, 2));
  }, [checkoutItems, calculatePrices]);

  useEffect(() => {
    if (checkoutItems) {
      fetch("/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkoutItems,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
          setPaymentIntentId(data.id);
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const appearance = {
    theme: "flat",
    variables: {
      fontFamily: "sans-serif",
      fontLineHeight: "1.5",
      borderRadius: "10px",
      colorBackground: "#FFFFFF",
      accessibleColorOnColorPrimary: "#FFFFFF",
    },
    rules: {
      ".Block": {
        backgroundColor: "#FFFFFF",
        boxShadow: "none",
        padding: "12px",
      },
      ".Input": {
        padding: "12px",
        fontWeight: "550",
        fontSize: "15px",
        border: "2px solid #cbd5e1",
      },
      ".Input::placeholder": {
        color: "#64748b",
      },
      ".Input:disabled, .Input--invalid:disabled": {
        color: "lightgray",
      },
      ".Tab": {
        padding: "10px 12px 8px 12px",
        border: "none",
      },
      ".Tab:hover": {
        border: "none",
        boxShadow:
          "0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)",
      },
      ".Tab--selected, .Tab--selected:focus, .Tab--selected:hover": {
        border: "none",
        backgroundColor: "#fff",
        boxShadow:
          "0 0 0 1.5px var(--colorPrimaryText), 0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)",
      },
      ".Label": {
        fontWeight: "500",
        fontSize: "14px",
        paddingBottom: "6px",
      },
    },
  };
  const options = {
    clientSecret,
    appearance,
  };

  if (checkoutItems) {
    return (
      <div className="w-full h-full relative">
        {stripePromise && clientSecret && (
          <Elements stripe={stripePromise} options={options} key={clientSecret}>
            {isLoading && (
              <div className="flex flex-col gap-5 absolute w-full h-full justify-center items-center bg-darkenBg z-50">
                <img
                  src={require("../images/payment-loading.gif")}
                  alt={"payment-loading"}
                  className=" w-48"
                />
                <p className="font-semibold text-lg text-white">
                  Processing payment. Please wait...
                </p>
              </div>
            )}
            <div className=" w-full h-full overflow-y-scroll flex">
              {checkoutProgress === 1 ? (
                <CheckoutShipping checkoutItems={checkoutItems} />
              ) : checkoutProgress === 2 ? (
                <CheckoutPayment checkoutItems={checkoutItems} />
              ) : (
                <OrderConfirmationPage cartData={checkoutItems} />
              )}
              <div className="w-1/2 h-full px-5 py-5 bg-slate-100 flex-col justify-center hidden md:flex">
                <div className="overflow-y-scroll">
                  {checkoutItems.map((product, index) => {
                    return <ItemCard productInfo={product} key={index} />;
                  })}
                </div>
                <div className=" bg-slate-400 w-full h-lineBreakHeight my-3" />
                <div>
                  <div className="flex justify-between px-5">
                    <p className="text-sm text-slate-600 mb-3">
                      Product's price
                    </p>
                    <p className="text-sm font-semibold">{`$${prices.productPrice} SGD`}</p>
                  </div>
                  <div className="flex justify-between px-5">
                    <p className="text-sm text-slate-600">Shipping</p>
                    <p className="text-sm font-semibold">{`$${prices.shippingPrice} SGD`}</p>
                  </div>
                  <div className="flex justify-between px-5 py-3">
                    <p className="text-sm font-semibold">Total</p>
                    <p className="text-sm font-semibold">{`$${prices.totalPrice} SGD`}</p>
                  </div>
                </div>
              </div>{" "}
            </div>
          </Elements>
        )}
      </div>
    );
  } else {
    return (
      <>
        <p>Cart is Null</p>
      </>
    );
  }
}
