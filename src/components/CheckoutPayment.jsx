import React, { useState, useContext, useEffect } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { FaChevronDown } from "react-icons/fa6";
import { AiOutlineCloseCircle } from "react-icons/ai";
import ItemCard from "./ItemCard";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CheckoutContext } from "../App";

export default function CheckoutPayment() {
  const {
    checkoutProgress,
    cartItems,
    showItems,
    setShowItems,
    isLoading, setIsLoading
  } = useContext(CheckoutContext);
  const [cardNumberError, setCardNumberError] = useState(true);
  const [expirationDateError, setExpirationDateError] = useState(true);
  const [securityCodeError, setSecurityCodeError] = useState(true);
  const [nameOnCardError, setNameOnCardError] = useState(true);
  const [message, setMessage] = useState("")

  const stripe = useStripe();
  const elements = useElements();

  useEffect(()=>{
    elements.fetchUpdates().then((result) => {
      if (result.error) {
        console.error("Error fetching updates:", result.error);
      } else {
        console.log("Successfully fetched updates:", result);
      }
    });
  },[])
  function checkCompleted(number) {
    if (checkoutProgress >= number) {
      return true;
    }
    return false;
  }

  const paymentElementOptions = {
    layout: "tabs",
  };

  const appearance = {
    theme: "flat",
    variables: {
      fontFamily: "sans-serif",
      fontLineHeight: "1.5",
      borderRadius: "10px",
      colorBackground: "#F6F8FA",
      accessibleColorOnColorPrimary: "#262626",
    },
    rules: {
      ".Block": {
        backgroundColor: "var(--colorBackground)",
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

  return (
    <div className="w-full h-full md:w-1/2">
      <div className="w-full h-full flex items-center relative justify-center flex-col px-3 sm:px-10 sm:min-w-[400px] py-5">
        {showItems ? (
          <div
            className={`w-full h-full overflow-y-scroll absolute bg-slate-200 z-30 md:hidden ${
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
        <div className="flex flex-col gap-3 w-full">
          <div className="font-semibold flex justify-between text-lg md:text-xl mb-10 w-full">
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
          <PaymentElement
            id="payment-element"
            options={paymentElementOptions}
          />
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

                setIsLoading(true);
                const { error } = await stripe.confirmPayment({
                  elements,
                  confirmParams: {
                    // Make sure to change this to your payment completion page
                    return_url: "http://localhost:3000/order-complete",
                  },
                });
                if (
                  error.type === "card_error" ||
                  error.type === "validation_error"
                ) {
                  setMessage(error.message);
                } else {
                  setMessage("An unexpected error occurred.");
                }

                setIsLoading(false);
              }}
            >
              Checkout
            </button>
          </div>
        </div>

        <div className="flex gap-5 w-full px-5 mt-7">
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
