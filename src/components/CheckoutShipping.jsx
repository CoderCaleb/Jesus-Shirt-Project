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
export default function CheckoutShipping() {
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
  } = useContext(CheckoutContext);

  function checkCompleted(number) {
    if (checkoutProgress >= number) {
      return true;
    }
    return false;
  }
  const addressElementOptions = {
    mode: "shipping",
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

            {cartItems.map((product, index) => {
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
            <p className="font-sans text-[14px] mb-2">Email Address</p>
            <div className="flex px-3 gap-2 bg-[#F6F8FA] items-center justify-between py-3 w-full min-h-[2.5rem] h-11 bg-transparent border-2 border-slate-300 outline-black rounded-[10px] text-sm font-semibold">
              <MdOutlineMail size={25} />
              <input
                placeholder="larrytan@gmail.com"
                className="bg-transparent h-full outline-none flex-1"
                onChange={(e) => {
                  setEmailAddress(e.target.value);
                }}
                value={emailAddress}
              />
            </div>
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
              if (shippingData.complete) {
                setCheckoutProgress(2);
              } else {
                toast(
                  "Please check your inputs. All fields are required and must be correctly filled.",
                  { type: "error" }
                );
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
      <ToastContainer />
    </div>
  );
}