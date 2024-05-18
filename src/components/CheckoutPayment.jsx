import React, { useState, useEffect, useContext } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { FaChevronDown } from "react-icons/fa6";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useLocation } from "react-router";
import ItemCard from "./ItemCard";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import { CheckoutContext, StateSharingContext } from "../App";
import { ToastContainer, toast } from "react-toastify";
export default function CheckoutPayment({checkoutItems}) {
  const {
    checkoutProgress,
    setCheckoutProgress,
    cartItems,
    showItems,
    setShowItems,
    isLoading,
    setIsLoading,
    emailAddress,
    clientSecret,
    shippingData,
  } = useContext(CheckoutContext);
  const { user } = useContext(StateSharingContext);
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
  function generateSequentialOrderNumber(lastOrderNumber) {
    console.log("last order no: ", lastOrderNumber);
    if (!lastOrderNumber) {
      return "ORD00001";
    }

    const numericPart = parseInt(lastOrderNumber.replace(/\D/g, ""), 10);

    const nextNumericPart = numericPart + 1;

    const nextOrderNumber = "ORD" + nextNumericPart.toString().padStart(5, "0");

    return nextOrderNumber;
  }
  useEffect(()=>{
    console.log(checkoutItems)
  },[])

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
          <div className="flex flex-col gap-3 w-full">
            <button
              className="border-2 w-full mt-5 h-12 font-semibold rounded-xl border-black bg-black text-white hover:bg-white hover:text-black"
              disabled={isLoading || !stripe || !elements}
              onClick={async (e) => {
                e.preventDefault();

                if (!stripe || !elements) {
                  return;
                }

                let message = "";

                setIsLoading(true);
                stripe
                  .confirmPayment({
                    elements,
                    confirmParams: {
                      return_url: "https://example.com",
                    },
                    redirect: "if_required",
                    payment_method_data: {
                      billing_details: {
                        email: emailAddress,
                      },
                    },
                  })
                  .then((result) => {
                    if (
                      result.error &&
                      (result.error.type === "card_error" ||
                        result.error.type === "validation_error")
                    ) {
                      message = result.error.message;
                    } else if (result.error) {
                      message = "An unexpected error occurred.";
                    } else {
                      if (result.paymentIntent.status === "succeeded") {
                        console.log("confirm result", result);
                        fetch("http://127.0.0.1:4242/get-latest-order")
                          .then((res) => res.json())
                          .then((latestOrder) => {
                            console.log("LATEST ORDER:", latestOrder);
                            if (!latestOrder.error) {
                              const orderData = {
                                customer: {
                                  emailAddress:
                                    result.paymentIntent.receipt_email,
                                  name: result.paymentIntent.shipping.name,
                                },
                                order_number: generateSequentialOrderNumber(
                                  latestOrder.maxOrderNumber
                                ),
                                status: "printing",
                                order_items: checkoutItems,
                                payment_id: result.paymentIntent.id,
                                shipping_address:
                                  result.paymentIntent.shipping.address,
                                shipping_cost: 3.5,
                                payment_method:
                                  result.paymentIntent.payment_method,
                                order_date: new Date().toISOString(),
                              };
                              fetch("http://127.0.0.1:4242/place-order", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  orderData,
                                }),
                              })
                                .then((res) => res.json())
                                .then((orderData) => {
                                  const { orderId } = orderData;
                                  console.log(orderData)
                                  if (user && !result.error) {
                                    fetch(
                                      "http://127.0.0.1:4242/add-order-to-user",
                                      {
                                        method: "POST",
                                        headers: {
                                          "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                          orderId: orderId,
                                          uid: user.uid,
                                        }),
                                      }
                                    );
                                  }
                                })
                                .then(() => {
                                  setIsLoading(false);
                                  if (!result.error) {
                                    setCheckoutProgress(3);
                                  } else {
                                    toast(message, { type: "error" });
                                  }
                                });
                            }
                          });
                      } else {
                        setIsLoading(false);
                      }
                    }
                  });
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
