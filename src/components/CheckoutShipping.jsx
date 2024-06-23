import React, { useState, useContext } from "react";
import { MdOutlineMail } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa6";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { CheckoutContext } from "../contexts";
import { AddressElement } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";

import ItemCard from "./ItemCard";
import InputField from "./InputField";

import { validateEmail } from "../utils/helpers"
import {checkCheckoutComplete} from "../utils/helpers"

export default function CheckoutShipping({ checkoutItems }) {
  const {
    checkoutProgress,
    setCheckoutProgress,
    showItems,
    setShowItems,
    emailAddress,
    setEmailAddress,
    setShippingData,
    shippingData,
    paymentIntentId,
  } = useContext(CheckoutContext);

  const [emailError, setEmailError] = useState("");

  const addressElementOptions = {
    mode: "shipping",
  };

  const handleShowItems = () => {
    setShowItems((prev) => !prev);
  };

  const handleEmailChange = (email) => {
    setEmailAddress(email);
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleContinueToPayment = async () => {
    if (shippingData.complete && validateEmail(emailAddress)) {
      try {
        await fetch("http://127.0.0.1:4242/update-payment-intent", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            payment_intent_id: paymentIntentId,
            shipping: shippingData.value,
            receipt_email: emailAddress,
          }),
        });
        setCheckoutProgress(2);
      } catch (err) {
        console.log(err);
      }
    } else {
      toast("Please check your inputs. All fields are required and must be correctly filled.", { type: "error" });
      if (!validateEmail(emailAddress)) {
        setEmailError("Please enter a valid email address");
      }
    }
  };

  return (
    <div className="w-full h-full md:w-1/2">
      <div className="w-full h-full flex items-center relative justify-center flex-col px-3 sm:px-10 sm:min-w-[400px] py-5">
        {showItems && (
          <div className="w-full h-full overflow-y-scroll absolute bg-slate-200 z-30 md:hidden animate-fade-up">
            <div className="flex items-center mx-5">
              <p className="text-3xl font-semibold sm:text-left text-center flex-1 my-5">
                Your Orders 🛒
              </p>
              <AiOutlineCloseCircle
                size={40}
                className="cursor-pointer"
                onClick={() => setShowItems(false)}
              />
            </div>
            {checkoutItems.map((product, index) => (
              <ItemCard productInfo={product} key={index} />
            ))}
          </div>
        )}
        <div className="flex flex-col gap-3 w-full overflow-y-scroll">
          <div className="font-semibold flex justify-between text-lg md:text-xl mb-10 w-full">
            <p className="flex-1">How do you want to get your order?</p>
          </div>
          <div
            className="text-base font-semibold flex absolute gap-2 items-center cursor-pointer md:hidden top-5 right-5"
            onClick={handleShowItems}
          >
            <p>My Order</p>
            <FaChevronDown />
          </div>
          <div>
            <InputField
              Icon={<MdOutlineMail size={22} />}
              setData={handleEmailChange}
              data={emailAddress}
              setError={setEmailError}
              error={emailError}
              label={"Email Address"}
              placeholder={"larrytan@gmail.com"}
            />
          </div>
          <div id="address-div" className="w-full">
            <AddressElement
              id="address-element"
              options={addressElementOptions}
              onChange={(event) => setShippingData(event)}
            />
          </div>
          <button
            className="border-2 w-full h-12 min-h-[3rem] font-semibold rounded-xl mt-5 border-black bg-black text-white hover:bg-white hover:text-black"
            onClick={handleContinueToPayment}
          >
            Continue to payment
          </button>
          <div className="flex gap-5 w-full px-5 mb-5 mt-12">
            <div className="flex-col flex-1 flex">
              <p className={`font-semibold ${checkCheckoutComplete(1,checkoutProgress) ? "text-black" : "text-slate-400"}`}>Shipping</p>
              <div className={`flex-1 rounded-xl mt-1 h-2 ${checkCheckoutComplete(1, checkoutProgress) ? "bg-black" : "bg-slate-300"}`} />
            </div>
            <div className="flex-col flex-1 gap-2">
              <p className={`font-semibold ${checkCheckoutComplete(2,checkoutProgress) ? "text-black" : "text-slate-400"}`}>Payment</p>
              <div className={`flex-1 rounded-xl mt-1 h-2 ${checkCheckoutComplete(2,checkoutProgress) ? "bg-black" : "bg-slate-300"}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
