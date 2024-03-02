import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import React, { useState, createContext, useEffect, useRef } from "react";
import Cart from "./components/Cart";
import Homepage from "./components/Homepage";
import Shop from "./components/Shop";
import Product from "./components/Product";
import RemoveItemModal from "./modals/removeItemModal";
import Checkout from "./components/Checkout";
import Navbar from "./components/Navbar";
export const StateSharingContext = createContext();
export const CheckoutContext = createContext();

// Function to safely parse JSON data
const safelyParseJSON = (jsonString) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null; // Return null or a default value when parsing fails
  }
};

// Retrieve and parse cartData
let parsedCartData;
try {
  const savedCartData = localStorage.getItem("cartData");
  parsedCartData =
    savedCartData && typeof savedCartData === "string"
      ? safelyParseJSON(savedCartData)
      : [];
} catch (error) {
  console.error("Error retrieving or parsing cartData:", error);
  parsedCartData = []; // Handle the error, set to null or another default value
}

// Retrieve and parse checkoutData
let parsedCheckoutData;
try {
  const savedCheckoutData = localStorage.getItem("checkoutData");
  parsedCheckoutData =
    savedCheckoutData && typeof savedCheckoutData === "string"
      ? safelyParseJSON(savedCheckoutData)
      : [];
} catch (error) {
  console.error("Error retrieving or parsing checkoutData:", error);
  parsedCheckoutData = []; // Handle the error, set to null or another default value
}

export default function App() {
  const [cartItems, setCartItems] = useState(parsedCartData);
  const [checkoutItems, setCheckoutItems] = useState(parsedCheckoutData);
  const [showRemoveItem, setShowRemoveItem] = useState({});
  // State variables for input values
  const [country, setCountry] = useState({
    name: "Singapore",
    "alpha-2": "SG",
    "alpha-3": "SGP",
    "country-code": "702",
    "iso_3166-2": "ISO 3166-2:SG",
    region: "Asia",
    "sub-region": "South-eastern Asia",
    "intermediate-region": "",
    "region-code": "142",
    "sub-region-code": "035",
    "intermediate-region-code": "",
  });
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [townCity, setTownCity] = useState("");
  const [state, setState] = useState("");
  const [postcode, setPostcode] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showItems, setShowItems] = useState(false);
  const [checkoutProgress, setCheckoutProgress] = useState(1);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const stateContextValue = {
    cartItems,
    setCartItems,
    showRemoveItem,
    setShowRemoveItem,
  };
  const checkoutContextValue = {
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
    showDropdown,
    setShowDropdown,
    cartItems,
    showItems,
    setShowItems,
    checkoutItems,
    setCheckoutItems,
    clientSecret,
    setClientSecret,
    paymentIntentId,
    setPaymentIntentId,
    isLoading,
    setIsLoading,
  };

  
  const location = useLocation();
  
  useEffect(() => {
    console.log(showRemoveItem);
  }, [showRemoveItem]);

  useEffect(() => {
    localStorage.setItem("cartData", JSON.stringify(cartItems));
  }, [cartItems]);


  return (
    <CheckoutContext.Provider value={checkoutContextValue}>
      <StateSharingContext.Provider value={stateContextValue}>
        <div>
          <Navbar from={location.pathname}/>
          <div className="w-screen h-[calc(100vh-64px)] bg-background flex z-[1]">
            <HandleModalComponent />
            <Routes>
              <Route index element={<Homepage />} />
              <Route path="cart" element={<Cart />} />
              <Route path="shop" element={<Outlet />}>
                <Route index element={<Shop />} />
                <Route path=":productId" element={<Product />} />
              </Route>
              <Route path="checkout" element={<Checkout />} />
              <Route path="*" element={<h1>Not found</h1>} />
            </Routes>
          </div>
        </div>
      </StateSharingContext.Provider>
    </CheckoutContext.Provider>
  );

  function HandleModalComponent() {
    return (
      <div>
        {showRemoveItem.state ? (
          <RemoveItemModal productData={showRemoveItem.productData} />
        ) : (
          <></>
        )}
      </div>
    );
  }
}
