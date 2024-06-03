import React, { useState, useContext } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { countryData } from "../countries";
import { MdOutlineMail } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa6";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { CheckoutContext } from "../App";
import ItemCard from "./ItemCard";
import { AddressElement } from "@stripe/react-stripe-js";
import { ToastContainer, toast } from "react-toastify";
import InputField from "./InputField";
export default function CheckoutShipping({checkoutItems}) {
  const {
    checkoutProgress,
    setCheckoutProgress,
    cartItems,
    showItems,
    setShowItems,
    emailAddress,
    setEmailAddress,
    setShippingData,
    shippingData,
    paymentIntentId
  } = useContext(CheckoutContext);
  const [emailError, setEmailError] = useState("")

  function checkCompleted(number) {
    if (checkoutProgress >= number) {
      return true;
    }
    return false;
  }
  const addressElementOptions = {
    mode: "shipping",
  };
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  return (
    <div className={`w-full h-full md:w-1/2`}>
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

            {checkoutItems.map((product, index) => {
              return <ItemCard productInfo={product} key={index} />;
            })}
          </div>
        ) : (
          <></>
        )}
        <div className="flex flex-col gap-3 w-full overflow-y-scroll">
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
          <div className="">
            <InputField Icon={<MdOutlineMail size={22}/>} setData={setEmailAddress} data={emailAddress} setError={setEmailError} error={emailError} label={"Email Address"} placeholder={"larrytan@gmail.com"}/>
          </div>
          <div id="address-div" className="w-full">
            <AddressElement
              id="address-element"
              options={addressElementOptions}
              onChange={(event) => {
                console.log(event);
                setShippingData(event)
              }}
            />
          </div>
          <button
            className="border-2 w-full h-12 min-h-[3rem] font-semibold rounded-xl mt-5 border-black bg-black text-white hover:bg-white hover:text-black"
            onClick={() => {
              if (shippingData.complete&&validateEmail(emailAddress)) {
                setCheckoutProgress(2);
                fetch("http://127.0.0.1:4242/update-payment-intent",{
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    payment_intent_id: paymentIntentId,
                    shipping: shippingData.value,
                    receipt_email: emailAddress
                  })
                }).catch(err=>console.log(err))
              } else {
                toast(
                  "Please check your inputs. All fields are required and must be correctly filled.",
                  { type: "error" }
                );
                if(!validateEmail(emailAddress)){
                  setEmailError("Please enter a valid email address")
                }
              }
            }}
          >
            Continue to payment
          </button>
          <div className="flex gap-5 w-full px-5 mb-5 mt-12">
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