import { Outlet, Route, Routes, useNavigate } from "react-router-dom";
import React, { useState, createContext, useEffect, useRef } from "react";
import SideBar from "./components/SideBar";
import Cart from "./components/Cart";
import Homepage from "./components/Homepage";
import Shop from "./components/Shop";
import Product from "./components/Product";
import RemoveItemModal from "./modals/removeItemModal";
import Checkout from "./components/Checkout";
import OrderConfirmationPage from "./components/OrderComfirmation";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
export const StateSharingContext = createContext();
export const CheckoutContext = createContext();

const savedCartData = localStorage.getItem("cartData")
  ? JSON.parse(localStorage.getItem("cartData"))
  : [];

const savedCheckoutData = localStorage.getItem("checkoutData")
  ? JSON.parse(localStorage.getItem("checkoutData"))
  : [];

const stripePromise = loadStripe(
  "pk_test_51OOBnGEvVCl2vla10CIfwh6ItUYeeZO4o3haVa9xFHyxwT6ekU8D8wAuA75GsRfGOhMLmU0Znf9dZKJPLNc5xrdq00PVRX8neU"
);

export default function App() {
  const [cartItems, setCartItems] = useState(savedCartData);
  const [checkoutItems, setCheckoutItems] = useState(savedCheckoutData);
  const [showRemoveItem, setShowRemoveItem] = useState({});
  const firstUpdate = useRef(true);
  const navigate = useNavigate();
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
    paymentIntentId,
    setPaymentIntentId,
    isLoading,
    setIsLoading,
  };

  useEffect(() => {
    console.log(showRemoveItem);
  }, [showRemoveItem]);

  useEffect(() => {
    localStorage.setItem("cartData", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    console.log(checkoutItems);
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    if (checkoutItems.length === 0) {
      return;
    }
    navigate("/checkout", { state: { cartData: checkoutItems } });
    localStorage.setItem("checkoutData", JSON.stringify(checkoutItems));
  }, [checkoutItems]);

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setPaymentIntentId(data.paymentIntentId);
        console.log(data.clientSecret);
        console.log(data);
      });
  }, []);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <CheckoutContext.Provider value={checkoutContextValue}>
      <StateSharingContext.Provider value={stateContextValue}>
        {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <div className="w-screen h-screen bg-background flex">
              <HandleModalComponent />
              <Routes>
                <Route
                  path="/"
                  element={<Outlet />}
                  errorElement={<h1>404</h1>}
                ></Route>
                <Route index element={<Homepage />} />
                <Route
                  path="cart"
                  element={
                    <div className="flex w-full h-full">
                      <SideBar />
                      <Cart />
                    </div>
                  }
                />
                <Route path="shop" element={<Outlet />}>
                  <Route
                    index
                    element={
                      <div className="flex w-full h-full">
                        <SideBar />
                        <Shop />
                      </div>
                    }
                  />
                  <Route
                    path=":productId"
                    element={
                      <div className="flex w-full h-full">
                        <SideBar />
                        <Product />
                      </div>
                    }
                  />
                </Route>
                <Route
                  path="checkout"
                  element={
                    <div className="flex w-full h-full">
                      <SideBar />
                      <Checkout />
                    </div>
                  }
                />
                <Route
                  path="/order-complete"
                  element={
                    <div className="flex w-full h-full">
                      <SideBar />
                      <OrderConfirmationPage />
                    </div>
                  }
                />
                <Route path="*" element={<h1>Not found</h1>} />
              </Routes>
            </div>
          </Elements>
        )}
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
