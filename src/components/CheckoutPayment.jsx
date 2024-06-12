import React, { useContext, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { FaChevronDown } from "react-icons/fa6";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router";
import ItemCard from "./ItemCard";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import MessageBox from "./MessageBox"
import { CheckoutContext } from "../contexts";
import { toast } from "react-toastify";

export default function CheckoutPayment({ checkoutItems }) {
  const {
    checkoutProgress,
    setCheckoutProgress,
    showItems,
    setShowItems,
    isLoading,
    setIsLoading,
    paymentIntentId,
  } = useContext(CheckoutContext);
  const [paymentError, setPaymentError] = useState(null)
  const location = useLocation()
  const { fromCart } = location.state;
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  function checkCompleted(number) {
    if (checkoutProgress >= number) {
      return true;
    }
    return false;
  }

  const paymentElementOptions = {
    layout: "tabs",
  };

  async function handlePayment() {
    console.log("Payment intent id:", paymentIntentId)
    const { paymentIntent, error } = stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `http://localhost:3000/checkout-complete?fromCart=${fromCart?"true":"false"}`,
      },
    });
    setIsLoading(false)
    if (error) {
      console.error(error); 
      toast(error,{type:"error"})
      setPaymentError(error)
    } else {
      console.log("Payment confirmed:", paymentIntent);
    }
  }
  return (
    <div className={`w-full h-full md:w-1/2`}>
      <div className="w-full h-full flex items-center relative justify-center flex-col px-3 sm:px-10 sm:min-w-[400px] py-5">
        {showItems ? (
          <div
            className={`w-full h-full overflow-y-scroll absolute bg-slate-200 md:hidden ${
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

            <div className="overflow-y-scroll z-40">
              {checkoutItems.map((product, index) => {
                return <ItemCard productInfo={product} key={index} />;
              })}
            </div>
          </div>
        ) : (
          <></>
        )}
        <div className="flex flex-col gap-3 w-full overflow-y-scroll">
          <div className="font-semibold flex items-center justify-between gap-3 text-lg md:text-xl mb-10 w-full">
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
          <div id="payment-div" className="w-[99%] m-auto">
            <PaymentElement
              id="payment-element"
              options={paymentElementOptions}
            />
          </div>
          {paymentError?<MessageBox type="error" message={paymentError}/>:<></>}
          <div className="flex flex-col gap-3 w-full">
            <button
              className="border-2 w-full mt-5 h-12 font-semibold rounded-xl border-black bg-black text-white hover:bg-white hover:text-black"
              disabled={isLoading || !stripe || !elements}
              onClick={async (e) => {
                e.preventDefault();

                if (!stripe || !elements) {
                  return;
                }
                setIsLoading(true);
                handlePayment()

              }}
            >
              Checkout
            </button>
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
    </div>
  );
}
