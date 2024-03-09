import React, { useState, useContext } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { FaChevronDown } from "react-icons/fa6";
import { AiOutlineCloseCircle } from "react-icons/ai";
import ItemCard from "./ItemCard";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import { CheckoutContext } from "../App";
import { ToastContainer, toast } from "react-toastify";
export default function CheckoutPayment() {
  const {
    checkoutProgress,
    setCheckoutProgress,
    cartItems,
    showItems,
    setShowItems,
    isLoading,
    setIsLoading,
  } = useContext(CheckoutContext);

  const stripe = useStripe();
  const elements = useElements();

  function checkCompleted(number) {
    if (checkoutProgress >= number) {
      return true;
    }
    return false;
  }

  const paymentElementOptions = {
    layout: "tabs",
  };

  return (
    <div className="w-full h-full flex justify-center px-3 sm:px-10 relative flex-col sm:min-w-[400px] md:w-1/2">
      {showItems ? (
        <div
          className={`w-full h-full absolute bg-slate-200 z-30 md:hidden ${
            showItems ? "animate-fade-up" : "animate-fade-down"
          }`}
        >
          <div className="flex items-center mx-5">
            <p className="text-3xl font-semibold sm:text-left text-center flex-1 my-5">
              Your Orders 🛒
            </p>
            <AiOutlineCloseCircle
              size={40}
              className="cursor-pointer"
              onClick={() => {
                setShowItems(false);
              }}
            />
          </div>

          {cartItems.map((product, index) => {
            return <ItemCard productInfo={product} />;
          })}
        </div>
      ) : (
        <></>
      )}
      <div className="overflow-y-scroll w-full">
        <div className="flex flex-col gap-3 w-[98%] m-auto">
          <div className="font-semibold flex items-center justify-between gap-3 text-lg md:text-xl my-10 w-full">
            <IoMdArrowBack
              size={22}
              className="cursor-pointer"
              onClick={() => {
                setCheckoutProgress(1);
              }}
            />
            <p className="flex-1">How do you want your order?</p>
          </div>
          <div
            className="text-base font-semibold flex absolute gap-2 items-center cursor-pointer md:hidden top-5 right-5"
            onClick={() => {
              setShowItems((prev) => !prev);
            }}
          >
            <p>My Order</p>
            <FaChevronDown />
          </div>

          <div id="payment-div">
            <PaymentElement
              id="payment-element"
              options={paymentElementOptions}
            />
          </div>
          <div className="flex flex-col gap-3 w-full">
            <button
              className="border-2 w-full mt-5 h-12 font-semibold rounded-xl border-black bg-black text-white hover:bg-white hover:text-black"
              disabled={isLoading || !stripe || !elements}
              onClick={async (e) => {
                e.preventDefault();

                if (!stripe || !elements) {
                  // Stripe.js hasn't yet loaded.
                  // Make sure to disable form submission until Stripe.js has loaded.
                  return;
                }

                let message = "";

                setIsLoading(true);
                const { error } = await stripe.confirmPayment({
                  elements,
                  confirmParams: {
                    return_url: "https://example.com",
                  },
                  redirect: "if_required",
                });

                if (
                  error &&
                  (error.type === "card_error" ||
                    error.type === "validation_error")
                ) {
                  message = error.message;
                } else {
                  message = "An unexpected error occurred.";
                }

                setIsLoading(false);
                if (!error) {
                  setCheckoutProgress(3);
                } else {
                  toast(message, { type: "error" });
                }
              }}
            >
              Checkout
            </button>
          </div>
        </div>

        <div className="flex gap-5 w-full px-5 my-12">
          <div className="flex-col flex-1 flex">
            <p
              className={`font-semibold ${
                checkCompleted(1) ? "text-black" : "text-slate-400"
              }`}
            >
              Shipping
            </p>
            <div
              className={`flex-1 rounded-xl mt-1 h-2 bg-black ${
                checkCompleted(1) ? "text-black" : "bg-slate-300"
              }`}
            />
          </div>
          <div className="flex-col flex-1 gap-2">
            <p
              className={`font-semibold ${
                checkCompleted(2) ? "text-black" : "text-slate-400"
              }`}
            >
              Payment
            </p>
            <div
              className={`flex-1 rounded-xl mt-1 h-2 bg-black ${
                checkCompleted(2) ? "text-black" : "bg-slate-300"
              }`}
            />
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

function InputError(props) {
  const { content, isValid } = props;

  return (
    <>
      {!isValid ? (
        <div>
          <p className="text-red-500 text-sm mt-2">{content}</p>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
