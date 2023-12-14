import React, { useState, useContext } from "react";
import { IoMdArrowBack } from "react-icons/io";

import { CheckoutContext } from "./Checkout";
export default function CheckoutPayment() {
  const {
    checkoutProgress,
    setCheckoutProgress,
    cardNumber,
    setCardNumber,
    expirationDate,
    setExpirationDate,
    nameOnCard,
    setNameOnCard,
    securityCode,
    setSecurityCode,
  } = useContext(CheckoutContext);
  const [cardNumberError, setCardNumberError] = useState(true);
  const [expirationDateError, setExpirationDateError] = useState(true);
  const [securityCodeError, setSecurityCodeError] = useState(true);
  const [nameOnCardError, setNameOnCardError] = useState(true);
  // Function to validate Card Number
  function isValidCardNumber(cardNumber) {
    // Validating a generic 16-digit credit card number
    const regex = /^[0-9]{16}$/;
    return regex.test(cardNumber);
  }

  // Function to validate Expiration Date (MM/YY)
  function isValidExpirationDate(expirationDate) {
    // Validating MM/YY format for expiration date
    const regex = /^(0[1-9]|1[0-2])\/[0-9]{2}$/;
    return regex.test(expirationDate);
  }

  // Function to validate Security Code
  function isValidSecurityCode(securityCode) {
    // Validating a 3 or 4-digit security code
    const regex = /^[0-9]{3,4}$/;
    return regex.test(securityCode);
  }

  // Function to validate Name on Card
  function isValidNameOnCard(nameOnCard) {
    // Alphabets and spaces allowed, 2 to 50 characters
    const regex = /^[a-zA-Z\s]{2,50}$/;
    return regex.test(nameOnCard);
  }

  function checkCompleted(number) {
    if (checkoutProgress >= number) {
      return true;
    }
    return false;
  }
  return (
    <div className="w-full flex items-center justify-center flex-col px-2 sm:px-10 sm:min-w-[400px] py-5 md:w-1/2">
      <div className="flex flex-col gap-3 w-full">
        <div className="mb-10 flex items-center gap-3">
          <IoMdArrowBack onClick={()=>setCheckoutProgress(prev=>prev-=1)} className="cursor-pointer"/>
          <p className="font-semibold text-xl w-full">
            How would you like to pay
          </p>
        </div>
        <div className="w-full">
          <p className="text-sm mb-2">Card number</p>
          <input
            placeholder="1234 5678 9012 3456"
            className="w-full h-10 bg-transparent border-2 border-slate-300 pl-3 outline-black rounded-lg text-sm placeholder-slate-500 font-semibold"
            onChange={(e) => {
              setCardNumber(e.target.value);
            }}
            value={cardNumber}
          />
          <InputError
            content="Please enter a valid 16-digit credit card number."
            isValid={cardNumberError}
          />
        </div>
        <div className="flex gap-3 w-full items-end">
          <div className="flex-1">
            <p className="text-sm mb-2">{"Expiration date (MM/YY)"}</p>
            <input
              placeholder="05/21"
              onChange={(e) => {
                setExpirationDate(e.target.value);
              }}
              value={expirationDate}
              className="w-full h-10 bg-transparent border-2 border-slate-300 pl-3 outline-black rounded-lg text-sm placeholder-slate-500 font-semibold"
            />
            <InputError
              content="Please enter a valid expiration date in MM/YY format."
              isValid={expirationDateError}
            />
          </div>
          <div className="flex-1">
            <p className="text-sm mb-2">Security code</p>
            <input
              placeholder="123"
              value={securityCode}
              onChange={(e) => {
                setSecurityCode(e.target.value);
              }}
              className="w-full h-10 bg-transparent border-2 border-slate-300 pl-3 outline-black rounded-lg text-sm placeholder-slate-500 font-semibold"
            />
            <InputError
              content="Please enter a valid 3 or 4-digit security code."
              isValid={securityCodeError}
            />
          </div>
        </div>
        <div className="w-full">
          <p className="text-sm mb-2">Name on card</p>
          <input
            placeholder="Larry Tan Yao Xuan"
            onChange={(e) => {
              setNameOnCard(e.target.value);
            }}
            value={nameOnCard}
            className="w-full h-10 bg-transparent border-2 border-slate-300 pl-3 outline-black rounded-lg text-sm placeholder-slate-500 font-semibold"
          />
          <InputError
            content="Please enter a valid name on the card"
            isValid={nameOnCardError}
          />
        </div>
        <div className="flex flex-col gap-3 w-full">
          <button
            className="border-2 w-full mt-5 h-12 font-semibold rounded-xl border-black bg-black text-white hover:bg-white hover:text-black"
            onClick={() => {
              setCardNumberError(isValidCardNumber(cardNumber));
              setExpirationDateError(isValidExpirationDate(expirationDate));
              setSecurityCodeError(isValidSecurityCode(securityCode));
              setNameOnCardError(isValidNameOnCard(nameOnCard));
              if (
                !isValidCardNumber(cardNumber) ||
                !isValidExpirationDate(expirationDate) ||
                !isValidSecurityCode(securityCode) ||
                !isValidNameOnCard(nameOnCard) || 1
              ) {
                setCheckoutProgress(3);
              }
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
