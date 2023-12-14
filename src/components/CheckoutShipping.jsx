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
    firstName,
    setFirstName,
    lastName,
    setLastName,
    streetAddress,
    setStreetAddress,
    townCity,
    setTownCity,
    state,
    setState,
    postcode,
    setPostcode,
    emailAddress,
    setEmailAddress,
  } = useContext(CheckoutContext);

  // State variables for error state (no error = true)
  const [firstNameError, setFirstNameError] = useState(true);
  const [lastNameError, setLastNameError] = useState(true);
  const [streetAddressError, setStreetAddressError] = useState(true);
  const [townCityError, setTownCityError] = useState(true);
  const [stateError, setStateError] = useState(true);
  const [postcodeError, setPostcodeError] = useState(true);
  const [emailAddressError, setEmailAddressError] = useState(true);
  // Function to validate First Name
  function isValidFirstName(firstName) {
    // Only alphabets allowed, 2 to 30 characters
    const regex = /^[a-zA-Z]{2,30}$/;
    return regex.test(firstName);
  }

  // Function to validate Last Name
  function isValidLastName(lastName) {
    // Only alphabets allowed, 2 to 30 characters
    const regex = /^[a-zA-Z]{2,30}$/;
    return regex.test(lastName);
  }

  // Function to validate Street Address
  function isValidStreetAddress(streetAddress) {
    // Alphanumeric and special characters allowed, 2 to 100 characters
    const regex = /^[a-zA-Z0-9\s,.'-]{2,100}$/;
    return regex.test(streetAddress);
  }

  // Function to validate Town/City
  function isValidTownCity(townCity) {
    // Only alphabets allowed, 2 to 50 characters
    const regex = /^[a-zA-Z\s]{2,50}$/;
    return regex.test(townCity);
  }

  // Function to validate State
  function isValidState(state) {
    // Only alphabets allowed, 2 to 30 characters
    const regex = /^[a-zA-Z]{2,30}$/;
    return regex.test(state);
  }

  // Function to validate Postcode
  function isValidPostcode(postcode) {
    // Alphanumeric allowed, 5 to 10 characters
    const regex = /^[a-zA-Z0-9]{4,10}$/;
    return regex.test(postcode);
  }

  // Function to validate Email Address
  function isValidEmailAddress(emailAddress) {
    // Basic email validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(emailAddress);
  }
  function checkCompleted(number) {
    if (checkoutProgress >= number) {
      return true;
    }
    return false;
  }
  return (
    <div className="w-full flex items-center justify-center px-3 sm:px-10 flex-col sm:min-w-[400px] py-5 overflow-y-scroll md:w-1/2">
      <p className="font-semibold text-xl mb-10 w-full">
        How would you like to get your order
      </p>
      <div className="flex gap-3 w-full mb-9">
        <div className="flex-1">
          <p className="text-sm mb-2">First name</p>
          <input
            placeholder="Larry"
            className="w-full h-10 bg-transparent border-2 border-slate-300 pl-3 outline-black rounded-lg text-sm placeholder-slate-500 font-semibold"
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            value={firstName}
          />
          <InputError content="Please enter a valid first name" isValid={firstNameError}/>
        </div>
        <div className="flex-1">
          <p className="text-sm mb-2">Last name</p>
          <input
            placeholder="Tan"
            className="w-full h-10 bg-transparent border-2 border-slate-300 pl-3 outline-black rounded-lg text-sm placeholder-slate-500 font-semibold"
            onChange={(e) => {
              setLastName(e.target.value);
            }}
            value={lastName}
          />
          <InputError content="Please enter a valid last name" isValid={lastNameError}/>
        </div>
      </div>
      <div className="flex flex-col gap-3 w-full">
        <div className="flex-1">
          <p className="text-sm mb-2">Street address</p>
          <input
            placeholder="100 Smith Street"
            onChange={(e) => {
              setStreetAddress(e.target.value);
            }}
            value={streetAddress}
            className="w-full h-10 bg-transparent border-2 border-slate-300 pl-3 outline-black rounded-lg text-sm placeholder-slate-500 font-semibold"
          />
          <InputError content="Please enter a valid street address" isValid={streetAddressError}/>
        </div>
        <div className="flex gap-3">
          <div className="w-3/5">
            <p className="text-sm mb-2">Town/City</p>
            <input
              placeholder="Collingwood"
              onChange={(e) => {
                setTownCity(e.target.value);
              }}
              value={townCity}
              className="w-full h-10 bg-transparent border-2 border-slate-300 pl-3 outline-black rounded-lg text-sm placeholder-slate-500 font-semibold"
            />
            <InputError content="Please enter a valid town/city" isValid={townCityError}/>
          </div>
          <div className="w-1/5">
            <p className="text-sm mb-2">State</p>
            <input
              placeholder="VIC"
              onChange={(e) => {
                setState(e.target.value);
              }}
              value={state}
              className="w-full h-10 bg-transparent border-2 border-slate-300 pl-3 outline-black rounded-lg text-sm placeholder-slate-500 font-semibold"
            />
            <InputError content="Please enter a valid state" isValid={stateError}/>
          </div>
          <div className="w-1/5">
            <p className="text-sm mb-2">Postcode</p>
            <input
              placeholder="3066"
              onChange={(e) => {
                setPostcode(e.target.value);
              }}
              value={postcode}
              className="w-full h-10 bg-transparent border-2 border-slate-300 pl-3 outline-black rounded-lg text-sm placeholder-slate-500 font-semibold"
            />
            <InputError content="Please enter a valid postcode." isValid={postcodeError}/>
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
                onChange={(e) => {
                  setEmailAddress(e.target.value);
                }}
                value={emailAddress}
              />
            </div>
            <InputError content="Please enter a valid email address." isValid={emailAddressError}/>
          </div>
        </div>
        <button
          className="border-2 w-full h-12 font-semibold rounded-xl mt-5 border-black bg-black text-white hover:bg-white hover:text-black"
          onClick={() => {
            setFirstNameError(isValidFirstName(firstName));
            setLastNameError(isValidLastName(lastName));
            setStreetAddressError(isValidStreetAddress(streetAddress));
            setTownCityError(isValidTownCity(townCity));
            setStateError(isValidState(state));
            setPostcodeError(isValidPostcode(postcode));
            setEmailAddressError(isValidEmailAddress(emailAddress));
            if (
              isValidFirstName(firstName) &&
              isValidLastName(lastName) &&
              isValidStreetAddress(streetAddress) &&
              isValidTownCity(townCity) &&
              isValidState(state) &&
              isValidPostcode(postcode) &&
              isValidEmailAddress(emailAddress) ||1
            ) {
              setCheckoutProgress(2);
            }
          }}
        >
          Continue to payment
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
