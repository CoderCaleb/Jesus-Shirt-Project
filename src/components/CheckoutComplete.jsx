import React, { useContext, useState, useEffect } from "react";
import { CiCircleCheck, CiCircleRemove } from "react-icons/ci";
import { useLocation, useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import { useStripe } from "@stripe/react-stripe-js";

import ItemCard from "./ItemCard";
import {DisplayShippingAddress} from "./DisplayShippingAddress";
import { StateSharingContext, CheckoutContext } from "../contexts";

const OrderConfirmationPage = () => {
  const { clientSecret, setCheckoutProgress, checkoutConfirmData } =
    useContext(CheckoutContext);
  const { setCartItems } = useContext(StateSharingContext);

  const [message, setMessage] = useState(null);
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const paymentIntentId = params.get("payment_intent");
  const fromCart = params.get("fromCart");

  useEffect(() => {
    if (paymentIntentId) {
      fetchPaymentIntent(paymentIntentId);
    }
  }, [paymentIntentId]);

  useEffect(() => {
    if (paymentIntent) {
      handlePaymentIntentInfo(paymentIntent);
      fetchOrderItemsData(paymentIntent);
      if (fromCart === "true") {
        setCartItems([]);
      }
    }
  }, [paymentIntent]);

  const fetchPaymentIntent = async (id) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:4242/retrieve-payment-intent?payment_intent_id=${id}`
      );
      const { paymentIntent } = await response.json();
      if (paymentIntent) {
        setPaymentIntent({
          ...paymentIntent,
          metadata: {
            ...paymentIntent.metadata,
            order_items: JSON.parse(paymentIntent.metadata.order_items.trim()),
            user_id:
              paymentIntent.metadata.user_id === "None"
                ? null
                : paymentIntent.metadata.user_id,
          },
        });
        window.history.replaceState({}, document.title);
      } else {
        setPaymentIntent(null);
      }
    } catch (error) {
      console.error("Failed to fetch payment intent:", error);
      setError("Failed to fetch payment intent");
    }
  };

  const fetchOrderItemsData = async (paymentIntent) => {
    try {
      const response = await fetch(`http://127.0.0.1:4242/get-orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_items: paymentIntent.metadata.order_items,
        }),
      });
      const { order_data, error } = await response.json();
      if (error) {
        setError(error);
      } else {
        setOrderItems(order_data);
      }
    } catch (error) {
      console.error("Failed to fetch order items:", error);
      setError("Failed to fetch order items");
    }
  };

  const handlePaymentIntentInfo = (paymentIntent) => {
    switch (paymentIntent.status) {
      case "succeeded":
        if (paymentIntent.metadata.orderStatus === "failed") {
          if (paymentIntent.metadata.error_number) {
            navigate(
              `/transaction-error?order-error-id=${paymentIntent.metadata.error_number}`
            );
          }
        } else if (paymentIntent.metadata.orderStatus === "processing") {
          setMessage("Order is processing");
        } else {
          toast.success("Payment succeeded!");
        }
        break;
      case "processing":
        setMessage("Your payment is processing.");
        toast.info("Your payment is processing.");
        break;
      case "requires_payment_method":
        setMessage("Payment not successful");
        toast.error("Your payment was not successful, please try again.");
        break;
      default:
        setMessage("Something went wrong.");
        toast.error("Something went wrong");
        break;
    }
  };

  return (
    <>
      {!error ? (
        paymentIntent && orderItems ? (
          <div className="w-full h-full flex items-center justify-around md:w-1/2">
            <div className="w-full flex h-full px-5 sm:px-10 flex-col sm:min-w-[400px] py-5">
              <div className="overflow-y-scroll w-full h-full">
                <p className="text-3xl font-bold my-7">Checkout</p>

                <div className="flex items-center gap-2">
                  {!message ? (
                    <CiCircleCheck size={45} />
                  ) : (
                    <CiCircleRemove size={45} />
                  )}
                  <div className="flex flex-col">
                    <p className="text-lg font-bold">
                      {message ? message : "Thank you"}
                    </p>
                    <p className="text-sm">{paymentIntent && paymentIntent.shipping && paymentIntent.shipping.name}</p>
                  </div>
                </div>
                <div className="flex-1">
                  {paymentIntent.metadata.orderStatus === "processing" ? (
                    <div className=" h-72 flex flex-col gap-3 text-center justify-center items-center">
                      <p>Your Payment Intent ID: {paymentIntentId}</p>
                      <p>
                        Your order is still being processed. Try reloading the page. If
                        you still get the same message, please contact our customer
                        support with your Payment Intent ID.
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-lg border-slate-300 border-1 text-sm mt-7 w-full">
                      <div className="p-3 gap-7 flex">
                        <p className="text-slate-500 font-semibold">
                          Order Number
                        </p>
                        <p className="text-black">
                          {!message
                            ? paymentIntent.metadata.order_id
                            : "Payment failed so order is not placed"}
                        </p>
                      </div>
                      <div className="p-3 gap-7 flex">
                        <p className="text-slate-500 font-semibold">Contact</p>
                        <p className="text-black">
                          {paymentIntent.receipt_email}
                        </p>
                      </div>
                      <div className=" bg-slate-300 w-full h-lineBreakHeight" />
                      <div className="p-3 gap-7 flex">
                        <p className="text-slate-500 font-semibold">Address</p>
                        <div className="flex flex-col gap-2">
                          <DisplayShippingAddress
                            address={paymentIntent.shipping && paymentIntent.shipping.address}
                            textStyle="text-black"
                          />
                        </div>
                      </div>
                      <div className=" bg-slate-300 w-full h-lineBreakHeight" />
                      <div className="flex pl-3 pt-3">
                        <p className="text-slate-500 font-semibold">Items</p>
                        <div className="w-full overflow-y-scroll h-60">
                          {orderItems.map((product, index) => {
                            return (
                              <ItemCard
                                productInfo={product}
                                index={index}
                                key={index}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="w-full">
                  <button
                    className="border-2 float-right w-44 mt-10 h-12 font-semibold rounded-lg border-black bg-black text-white hover:bg-white hover:text-black"
                    onClick={() => {
                      setCheckoutProgress(1);
                      navigate("/shop");
                    }}
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
            <ToastContainer position="top-center" theme="light" />
          </div>
        ) : (
          <div className="md:w-1/2 w-full">
            {message ? message : "Order loading..."}
          </div>
        )
      ) : (
        <div className="order-confirmation-page">
          <div className="error-message">{error}</div>
        </div>
      )}
    </>
  );
};

export default OrderConfirmationPage;
