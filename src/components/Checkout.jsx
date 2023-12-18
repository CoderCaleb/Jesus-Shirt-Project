import React, { useState, createContext, useEffect, useContext } from "react";
import { useLocation } from "react-router";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import CheckoutShipping from "./CheckoutShipping";
import CheckoutPayment from "./CheckoutPayment";
import OrderConfirmationPage from "./OrderComfirmation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import ItemCard from "./ItemCard";
import { CheckoutContext } from "../App";

export default function Checkout() {
  const {
    checkoutProgress,
    checkoutItems,
    clientSecret,
    paymentIntentId,
    isLoading,
    setIsLoading,
  } = useContext(CheckoutContext);
  const location = useLocation();
  const shippingPrice = 2;
  function calculateProductPrice() {
    const productPrice = checkoutItems.reduce((total, items) => {
      return total + items.price * items.quantity;
    }, 0);
    return Number(productPrice.toFixed(2));
  }
  function calculateTotalPrice() {
    const total = calculateProductPrice() + shippingPrice;
    return Number(total).toFixed(2);
  }
  useEffect(() => {
    console.log("Checkout Items", checkoutItems);
    fetch("/update-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentIntentId,
        checkoutItems,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // Handle success, if needed
        console.log("PaymentIntent updated successfully", data);
      })
      .catch((error) => {
        // Handle error
        console.error("Error updating PaymentIntent", error);
      });
  }, []);

  useEffect(() => {
    console.log(clientSecret);
  }, [clientSecret]);

  if (checkoutItems) {
    return (
      <div className="w-full h-full relative">
        {isLoading && (
          <div className="flex flex-col gap-5 absolute w-full h-full justify-center items-center bg-darkenBg z-50">
            <img src={require("../images/payment-loading.gif")} alt={"payment-loading"} className=" w-48"/>
            <p className="font-semibold text-lg text-white">Processing payment. Please wait...</p>
          </div>
        )}
        <div className=" w-full h-full overflow-y-scroll flex">
          {checkoutProgress === 1 ? (
            <CheckoutShipping cartData={checkoutItems} />
          ) : (
            <CheckoutPayment cartData={checkoutItems} />
          )}
          <div className="w-1/2 px-5 py-5 bg-slate-200 flex-col justify-center hidden md:flex">
            <div>
              {checkoutItems.map((product, index) => {
                return <ItemCard productInfo={product} />;
              })}
            </div>
            <div className=" bg-slate-400 w-full h-lineBreakHeight my-3" />
            <div>
              <div className="flex justify-between px-5">
                <p className="text-sm text-slate-600 mb-3">Product's price</p>
                <p className="text-sm font-semibold">{`$${calculateProductPrice()} SGD`}</p>
              </div>
              <div className="flex justify-between px-5">
                <p className="text-sm text-slate-600">Shipping</p>
                <p className="text-sm font-semibold">{`$${shippingPrice} SGD`}</p>
              </div>
              <div className="flex justify-between px-5 py-3">
                <p className="text-sm font-semibold">Total</p>
                <p className="text-sm font-semibold">{`$${calculateTotalPrice()} SGD`}</p>
              </div>
            </div>
          </div>{" "}
        </div>
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
