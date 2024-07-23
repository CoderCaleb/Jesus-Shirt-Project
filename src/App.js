import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import React, { useState, createContext, useEffect } from "react";
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { ToastContainer } from "react-toastify";
import Cart from "./components/Cart";
import Homepage from "./components/Homepage";
import Shop from "./components/Shop";
import Product from "./components/Product";
import Login from "./components/Login";
import RemoveItemModal from "./modals/RemoveItemModal";
import Checkout from "./components/Checkout";
import Navbar from "./components/Navbar";
import OrderTracking from "./components/OrderTracking";
import Orders from "./components/Orders";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import CheckoutComplete from "./components/CheckoutComplete";
import TransactionFailedError from "./components/TransactionFailedError";
import useUserToken from "./hooks/useUserToken";
import {
  safelyParseJSON,
  calculatePrices,
  handleGetUserInfo,
} from "./utils/helpers";
import { firebaseConfig } from "./config/firebaseConfig";
import {
  StateSharingContext,
  CheckoutContext,
  HelperFunctionContext,
} from "./contexts";
import ProfileSettings from "./components/ProfileSettings";
import AccountSettings from "./components/AccountSettings";
import ReauthenticateAndChangeEmailModal from "./modals/ReauthenticateModal";
import ChangePasswordModal from "./modals/ChangePasswordModal";

initializeApp(firebaseConfig);
getAnalytics();
const auth = getAuth();
auth.languageCode = auth.useDeviceLanguage();

const App = () => {
  const [cartItems, setCartItems] = useState(
    safelyParseJSON(localStorage.getItem("cartData")) || []
  );
  const [checkoutItems, setCheckoutItems] = useState(
    safelyParseJSON(localStorage.getItem("checkoutData")) || []
  );
  const [showRemoveItem, setShowRemoveItem] = useState({
    state: false,
    productData: "",
  });
  const [showReauthenticateModal, setShowReauthenticateModal] = useState({
    state: false,
  });
  const [showChangePasswordModal, setShowChangePasswordModal] = useState({
    state: false,
  });  
  const [emailAddress, setEmailAddress] = useState("");
  const [showItems, setShowItems] = useState(false);
  const [checkoutProgress, setCheckoutProgress] = useState(1);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shippingData, setShippingData] = useState({});
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [orderNumber, setOrderNumber] = useState("");
  const [checkoutConfirmData, setCheckoutConfirmData] = useState({});
  const userToken = useUserToken(user);

  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("cartData", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      //If not signed in, set user to false. If not firebase not loaded yet, user is null
      setUser(user ? user : false);
      console.log(user, "AUTH STATE CHANGED");
    });
    return () => unsubscribe();
  }, []);

  return (
    <HelperFunctionContext.Provider
      value={{ handleGetUserInfo, calculatePrices }}
    >
      <CheckoutContext.Provider
        value={{
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
        }}
      >
        <StateSharingContext.Provider
          value={{
            cartItems,
            setCartItems,
            showRemoveItem,
            setShowRemoveItem,
            showReauthenticateModal,
            setShowReauthenticateModal,
            showChangePasswordModal,
            setShowChangePasswordModal,
            user,
            userInfo,
            setUserInfo,
            userToken,
          }}
        >
          <div>
            <Navbar from={location.pathname} />

            <div className="w-screen h-[calc(100vh-64px)] bg-background flex z-[1]">
              <RemoveItemModal productData={showRemoveItem.productData} />
              <ReauthenticateAndChangeEmailModal />
              <ChangePasswordModal/>
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
                <Route
                  path="transaction-error"
                  element={<TransactionFailedError />}
                />
                <Route
                  path="checkout-complete"
                  element={<CheckoutComplete />}
                />
                <Route path="profile" element={<Profile />}>
                  <Route index element={<ProfileSettings />} />
                  <Route path="account" element={<AccountSettings />} />
                </Route>
                <Route path="*" element={<h1>Not found</h1>} />
              </Routes>
            </div>
            <ToastContainer position="top-center" theme="light" />
          </div>
        </StateSharingContext.Provider>
      </CheckoutContext.Provider>
    </HelperFunctionContext.Provider>
  );
};

export default App;
