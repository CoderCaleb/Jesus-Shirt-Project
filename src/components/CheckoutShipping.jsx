import React, { useState, useContext } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { countryData } from "../countries";
import { MdOutlineMail } from "react-icons/md";
import { CheckoutContext } from "./Checkout";
export default function CheckoutShipping() {
  const {
    checkoutProgress,
    setCheckoutProgress,
    country,
    setCountry,
    showDropdown,
    setShowDropdown,
  } = useContext(CheckoutContext);
  function checkCompleted(number){
    if(checkoutProgress>=number){
        return true
    }
    return false
  }
  return (
    <div className="w-1/2 flex items-center flex-col px-10 min-w-[500px] py-5">
      <p className="font-semibold text-xl mb-10 w-full">
        How would you like to get your order
      </p>
      <div className="flex gap-3 w-full mb-9">
        <div className="flex-1">
          <p className="text-sm mb-2">First name</p>
          <input
            placeholder="Larry"
            className="w-full h-10 bg-transparent border-2 border-slate-300 pl-3 outline-black rounded-lg text-sm placeholder-slate-500 font-semibold"
          />
        </div>
        <div className="flex-1">
          <p className="text-sm mb-2">Last name</p>
          <input
            placeholder="Tan"
            className="w-full h-10 bg-transparent border-2 border-slate-300 pl-3 outline-black rounded-lg text-sm placeholder-slate-500 font-semibold"
          />
        </div>
      </div>
      <div className="flex flex-col gap-3 w-full">
        <div className="flex-1">
          <p className="text-sm mb-2">Street address</p>
          <input
            placeholder="100 Smith Street"
            className="w-full h-10 bg-transparent border-2 border-slate-300 pl-3 outline-black rounded-lg text-sm placeholder-slate-500 font-semibold"
          />
        </div>
        <div className="flex gap-3">
          <div className="w-3/5">
            <p className="text-sm mb-2">Town/City</p>
            <input
              placeholder="Collingwood"
              className="w-full h-10 bg-transparent border-2 border-slate-300 pl-3 outline-black rounded-lg text-sm placeholder-slate-500 font-semibold"
            />
          </div>
          <div className="w-1/5">
            <p className="text-sm mb-2">State</p>
            <input
              placeholder="VIC"
              className="w-full h-10 bg-transparent border-2 border-slate-300 pl-3 outline-black rounded-lg text-sm placeholder-slate-500 font-semibold"
            />
          </div>
          <div className="w-1/5">
            <p className="text-sm mb-2">Postcode</p>
            <input
              placeholder="3066"
              className="w-full h-10 bg-transparent border-2 border-slate-300 pl-3 outline-black rounded-lg text-sm placeholder-slate-500 font-semibold"
            />
          </div>
        </div>
        <div className="flex-1 relative">
          <p className="text-sm mb-2">Country</p>
          <div className="flex items-center justify-between px-3 w-full h-10 bg-transparent border-2 border-slate-300 outline-black rounded-lg text-sm font-semibold">
            <div className="flex gap-3">
              <span
                className={`fi fi-${country["alpha-2"].toLowerCase()}`}
              ></span>
              <p>{country.name}</p>
            </div>
            <RiArrowDropDownLine
              size={30}
              color={"black"}
              className="cursor-pointer"
              onClick={() => {
                setShowDropdown(!showDropdown);
              }}
            />
          </div>
          <div
            className={`absolute bg-white flex-col w-full rounded-lg h-44 overflow-y-scroll top-20 text-sm font-semibold ${
              showDropdown ? "flex" : "hidden"
            }`}
          >
            {countryData.map((country, index) => {
              return (
                <div
                  className="px-5 py-2 flex gap-3 cursor-pointer"
                  onClick={() => {
                    setCountry(country);
                  }}
                >
                  <span
                    className={`fi fi-${country["alpha-2"].toLowerCase()}`}
                  ></span>
                  <p>{country.name}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <div className="pt-5">
            <p className="text-sm mb-2">Email Address</p>
            <div className="flex gap-2 items-center justify-between px-3 w-full h-10 bg-transparent border-2 border-slate-300 outline-black rounded-lg text-sm font-semibold">
              <MdOutlineMail size={25} />
              <input
                placeholder="larrytan@gmail.com"
                className="bg-transparent h-full outline-none flex-1"
              />
            </div>
          </div>
        </div>
        <button
          className="border-2 w-full h-12 font-semibold rounded-xl mt-5 border-black bg-black text-white hover:bg-white hover:text-black"
          onClick={() => {
            setCheckoutProgress(2)
          }}
        >
          Continue to payment
        </button>
      </div>
      <div className="flex gap-5 w-full px-5 mt-7">
        <div className="flex-col flex-1 flex">
          <p className={`font-semibold ${checkCompleted(1)?"text-black":"text-slate-400"}`}>Shipping</p>
          <div className={`flex-1 rounded-xl mt-1 h-2 bg-black ${checkCompleted(1)?"text-black":"bg-slate-300"}`} />
        </div>
        <div className="flex-col flex-1 gap-2">
          <p className={`font-semibold ${checkCompleted(2)?"text-black":"text-slate-400"}`}>Payment</p>
          <div className={`flex-1 rounded-xl mt-1 h-2 bg-black ${checkCompleted(2)?"text-black":"bg-slate-300"}`}/>
        </div>
      </div>
    </div>
  );
}
