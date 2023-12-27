import React, { useContext, useState, useEffect, useRef } from "react";
import { CiCircleCheck } from "react-icons/ci";
import { useLocation, useNavigate } from "react-router";
import ItemCard from "./ItemCard";
import { CheckoutContext } from "../App";
import { useStripe } from "@stripe/react-stripe-js";
import { ToastContainer, toast } from "react-toastify";

const OrderConfirmationPage = () => {
  const {
    emailAddress,
    firstName,
    streetAddress,
    townCity,
    state,
    postcode,
    clientSecret,
    setCheckoutProgress
  } = useContext(CheckoutContext);
  const [message, setMessage] = useState("");
  const checkoutItemsSaved = useRef([])
  const stripe = useStripe();
  const location = useLocation()
  const {checkoutItems} = location.state

  const navigate = useNavigate();

  useEffect(() => {
    if (!stripe) {
      return;
    }
    if (!clientSecret) {
      return;
    }
    console.log(clientSecret)

    checkoutItemsSaved.current = checkoutItems
    window.history.replaceState({}, document.title)

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Thank you!");
          toast("Payment succeeded!", {
            type: "success",
          });
          break;
        case "processing":
          setMessage("Your payment is processing.");
          toast("Your payment is processing.", {
            type: "info",
          });
          break;
        case "requires_payment_method":
          setMessage("Payment not successful");
          toast("Your payment was not successful, please try again.", {
            type: "error",
          });
          break;
        default:
          setMessage("Something went wrong.");
          toast("Something went wrong", {
            type: "error",
          });
          break;
      }
    });
  }, [stripe]);

  useEffect(()=>{
    console.log(message)
  },[message])
    
  return (
    <div className="w-full h-full flex items-center justify-around md:w-1/2">
      
      <div className="w-full flex h-min px-5 sm:px-10 flex-col sm:min-w-[400px] py-5 overflow-y-scroll">
        <p className="text-xl font-bold mb-7">Checkout</p>

        <div className="flex items-center gap-2">
          <CiCircleCheck size={45} />
          <div className="flex flex-col">
            <p className="text-lg font-bold">{message}</p>
            <p className="text-sm">{`${firstName}`}</p>
          </div>
        </div>
        <div className="rounded-lg border-slate-300 border-1 text-sm mt-7">
          <div className="p-3 gap-7 flex">
            <p className="text-slate-500 font-semibold">Contact</p>
            <p className="text-black">{emailAddress}</p>
          </div>
          <div className=" bg-slate-300 w-full h-lineBreakHeight" />
          <div className="p-3 gap-7 flex">
            <p className="text-slate-500 font-semibold">Address</p>
            <div className="flex flex-col gap-2">
              <p className="text-black">{streetAddress}</p>
              <p className="text-black">{townCity}</p>
              <p className="text-black">{state}</p>
              <p className="text-black">{postcode}</p>
            </div>
          </div>
          <div className=" bg-slate-300 w-full h-lineBreakHeight" />
          <div className="flex pl-3 pt-3">
            <p className="text-slate-500 font-semibold">Items</p>
            <div className="w-full overflow-y-scroll">
              {checkoutItemsSaved.current.map((product, index) => {
                return <ItemCard productInfo={product} />;
              })}
            </div>
          </div>
        </div>
        <div className="w-full">
          <button
            className="border-2 float-right w-44 mt-10 h-12 font-semibold rounded-lg border-black bg-black text-white hover:bg-white hover:text-black"
            onClick={() => {
              setCheckoutProgress(1)
              navigate("/shop");
            }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
      <ToastContainer position="top-center" theme="light" />
    </div>
  );
};

export default OrderConfirmationPage;
