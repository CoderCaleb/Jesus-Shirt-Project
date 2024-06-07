import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import React, { useState, createContext, useEffect, useRef } from "react";
import Cart from "./components/Cart";
import Homepage from "./components/Homepage";
import Shop from "./components/Shop";
import Product from "./components/Product";
import Login from "./components/Login";
import RemoveItemModal from "./modals/removeItemModal";
import Checkout from "./components/Checkout";
import Navbar from "./components/Navbar";
import OrderTracking from "./components/OrderTracking";
import Orders from "./components/Orders";
import { getAuth } from "firebase/auth";
import { ToastContainer } from "react-toastify";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import Signup from "./components/Signup";
import useUserToken from "./hooks/useUserToken";
import TransactionFailedError from "./components/TransactionFailedError";
import Profile from "./components/Profile";
import CheckoutComplete from "./components/CheckoutComplete.jsx"

const firebaseConfig = {
  apiKey: "AIzaSyCazb0ngI_9_HHTERIbThanmB38l01nUrQ",
  authDomain: "jesus-shirt-project.firebaseapp.com",
  projectId: "jesus-shirt-project",
  storageBucket: "jesus-shirt-project.appspot.com",
  messagingSenderId: "881328349632",
  appId: "1:881328349632:web:2ad3f9518f15460682e825",
  measurementId: "G-DL67MPY96D",

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
auth.languageCode = auth.useDeviceLanguage();

export const StateSharingContext = createContext();
export const CheckoutContext = createContext();
export const HelperFunctionContext = createContext();

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
  parsedCartData = [];
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
  parsedCheckoutData = [];
}

export default function App() {
  const [cartItems, setCartItems] = useState(parsedCartData);
  const [checkoutItems, setCheckoutItems] = useState(parsedCheckoutData);
  const [showRemoveItem, setShowRemoveItem] = useState({});
  // State variables for input values

  const [emailAddress, setEmailAddress] = useState("");
  const [showItems, setShowItems] = useState(false);
  const [checkoutProgress, setCheckoutProgress] = useState(1);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shippingData, setShippingData] = useState({});
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [orderNumber, setOrderNumber] = useState("")
  const [checkoutConfirmData, setCheckoutConfirmData] = useState({})
  const userToken = useUserToken(user)


  async function handleGetUserInfo(uid) {
    try {
      if (user && uid&&userToken) {
        const response = await fetch(`http://127.0.0.1:4242/get-user?uid=${user.uid}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        const result = await response.json();
        setUserInfo(result);
      } else {
        setUserInfo(null);
      }
    } catch (error) {
      console.log(error);
      setUserInfo(null);
    }
  }
  function calculatePrices(products, shippingPrice) {
    const productPrice = products.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0).toFixed(2);

    const totalPrice = (parseFloat(productPrice) + parseFloat(shippingPrice)).toFixed(2);

    return {
        productPrice: Number(productPrice),
        totalPrice: Number(totalPrice),
        shippingPrice: Number(shippingPrice)
    };
}

  const stateContextValue = {
    cartItems,
    setCartItems,
    showRemoveItem,
    setShowRemoveItem,
    user,
    userInfo,
    setUserInfo,
    userToken,
  };


  const checkoutContextValue = {
    checkoutProgress,
    setCheckoutProgress,
    emailAddress,
    setEmailAddress,
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
    shippingData,
    setShippingData,
    orderNumber,
    setOrderNumber,
    checkoutConfirmData,
    setCheckoutConfirmData,
  };

  const helperFunctionContextValue = {
    handleGetUserInfo,
    calculatePrices,

  };

  const location = useLocation();


  useEffect(() => {
    console.log(showRemoveItem);
  }, [showRemoveItem]);

  useEffect(() => {
    localStorage.setItem("cartData", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);



  return (
    <HelperFunctionContext.Provider value={helperFunctionContextValue}>
      <CheckoutContext.Provider value={checkoutContextValue}>
        <StateSharingContext.Provider value={stateContextValue}>
          <div>
            <Navbar from={location.pathname} />
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
                <Route path="orders" element={<Outlet />}>
                  <Route index element={<Orders />} />
                  <Route path=":orderId" element={<OrderTracking />} />
                </Route>
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
                <Route path="transaction-error" element={<TransactionFailedError />} />
                <Route path="profile" element={<Profile />} /> 
                <Route path="checkout-complete" element={<CheckoutComplete/>}/>
                <Route path="*" element={<h1>Not found</h1>} />
              </Routes>
            </div>
            <ToastContainer position="top-center" theme="light" />
          </div>
        </StateSharingContext.Provider>
      </CheckoutContext.Provider>
    </HelperFunctionContext.Provider>
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
