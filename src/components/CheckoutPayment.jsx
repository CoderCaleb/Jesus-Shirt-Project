import React, { useState, useEffect, useContext } from "react";
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

import {
  CheckoutContext,
  StateSharingContext,
  HelperFunctionContext,
} from "../App";
import { ToastContainer, toast } from "react-toastify";
import useUserToken from "../hooks/useUserToken";
export default function CheckoutPayment({ checkoutItems }) {
  const {
    checkoutProgress,
    setCheckoutProgress,
    cartItems,
    showItems,
    setShowItems,
    isLoading,
    setIsLoading,
    emailAddress,
    setOrderNumber,
    checkoutConfirmData,
    setCheckoutConfirmData,
  } = useContext(CheckoutContext);
  const { user } = useContext(StateSharingContext);
  const userToken = useUserToken(user);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  function checkCompleted(number) {
    if (checkoutProgress >= number) {
      return true;
    }
    return false;
  }

  async function updatePaymentError() {
    try{
      const res = await fetch(
        `http://127.0.0.1:4242/update-payment-error`
      );
      if(!res.ok){
        const errorData = await res.json()
        return { error: errorData.error };
      }
      const paymentErrorData = await res.json()
      return paymentErrorData
    }
    catch(error){
      console.error('Error fetching payment error data:', error);
      return { error: error.message };
    }

  }

  function handleTransactionError(order_error_id) {
    if (order_error_id) {
      navigate(`/transaction-error?order-error-id=${order_error_id}`);
    }
  }
  async function handlePaymentError() {
    const paymentErrorData = await updatePaymentError()
    if (paymentErrorData&&!paymentErrorData.error&&paymentErrorData.payment_error_id) {
      navigate(`/payment-error?payment-error-id=${paymentErrorData.payment_error_id}`);
    }
  }

  const paymentElementOptions = {
    layout: "tabs",
  };
  const shippingPrice = 2;

  useEffect(() => {
    console.log(checkoutItems);
  }, []);

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
                  })
                  .then((result) => {
                    if (
                      result.error &&
                      (result.error.type === "card_error" ||
                        result.error.type === "validation_error")
                    ) {
                      message = result.error.message;
                      toast(message, { type: "error" });
                      handlePaymentError();
                    } else if (result.error) {
                      message = "An unexpected error occurred.";
                      toast(message, { type: "error" });
                      handlePaymentError();
                    } else {
                      if (result.paymentIntent.status === "succeeded") {
                        const orderData = {
                          customer: {
                            emailAddress: result.paymentIntent.receipt_email,
                            name: result.paymentIntent.shipping.name,
                          },
                          status: "printing",
                          order_items: checkoutItems,
                          total_price: result.paymentIntent.amount,
                          payment_id: result.paymentIntent.id,
                          shipping_address:
                            result.paymentIntent.shipping.address,
                          shipping_cost: 3.5,
                          payment_method: result.paymentIntent.payment_method,
                          order_date: new Date().toISOString(),
                          linked_user: user ? user.uid : null,
                        };
                        console.log("confirm result", result);
                        fetch("http://127.0.0.1:4242/place-order", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: user ? `Bearer ${userToken}` : null,
                          },
                          body: JSON.stringify({
                            orderData: orderData,
                            uid: user ? user.uid : null,
                          }),
                        })
                          .then((res) => res.json())
                          .then((result) => {
                            setIsLoading(false);
                            if (result.orderResult) {
                              const { orderData } = result.orderResult;

                              setCheckoutProgress(3);
                              setCheckoutConfirmData(orderData);
                            } else {
                              handleTransactionError(result.order_error_id);
                            }
                          })
                          .catch((e) => {
                            console.log(e);
                            toast(e, { type: "error" });
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
