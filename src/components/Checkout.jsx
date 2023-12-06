import React, { useState, createContext } from "react";
import { useLocation } from "react-router";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import CheckoutShipping from "./CheckoutShipping";
import CheckoutPayment from "./CheckoutPayment";
export const CheckoutContext = createContext();
export default function Checkout() {
  const location = useLocation();
  const [checkoutProgress, setCheckoutProgress] = useState(1);
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
  const [showDropdown, setShowDropdown] = useState(false);
  const checkoutContextValue = {
    checkoutProgress,
    setCheckoutProgress,
    country,
    setCountry,
    showDropdown,
    setShowDropdown,
  };
  if (location.state) {
    const { cartData } = location.state;
    const shippingPrice = 2;
    function calculateProductPrice() {
      const productPrice = cartData.reduce((total, items) => {
        return total + items.price * items.quantity;
      }, 0);
      return Number(productPrice.toFixed(2));
    }
    function calculateTotalPrice() {
      const total = calculateProductPrice() + shippingPrice;
      return Number(total).toFixed(2);
    }
    return (
      <CheckoutContext.Provider value={checkoutContextValue}>
        <div className=" w-full overflow-y-scroll flex">
          {checkoutProgress === 1 ? <CheckoutShipping /> : <CheckoutPayment />}
          <div className="w-1/2 px-5 py-5 bg-slate-200">
            <div>
              {cartData.map((product, index) => {
                return <ItemCard productInfo={product} />;
              })}
            </div>
            <div className=" bg-slate-400 w-full h-lineBreakHeight my-3" />
            <div>
              <div className="flex justify-between px-5">
                <p className="text-sm text-slate-600 mb-3">Product's price</p>
                <p className="text-sm font-semibold">{`$${calculateProductPrice()} SGD`}</p>
              </div>
              <div className="flex justify-between px-5">
                <p className="text-sm text-slate-600">Shipping</p>
                <p className="text-sm font-semibold">{`$${shippingPrice} SGD`}</p>
              </div>
              <div className="flex justify-between px-5 py-3">
                <p className="text-sm font-semibold">Total</p>
                <p className="text-sm font-semibold">{`$${calculateTotalPrice()} SGD`}</p>
              </div>
            </div>
          </div>{" "}
        </div>
      </CheckoutContext.Provider>
    );

    function ItemCard(props) {
      const { productInfo } = props;
      return (
        <div className="flex w-full justify-between p-6 items-center">
          <div className="flex gap-3 items-center">
            <div className="w-16 h-16 relative border-1 border-slate-300 bg-slate-300 rounded-lg p-1 flex items-center justify-center">
              <img
                alt="item"
                src={require(`../images/${productInfo.image}`)}
                className="w-full h-full"
              />
              <div className="absolute bg-black rounded-3xl w-5 h-5 flex items-center justify-center text-white font-semibold text-sm -top-1 -left-1">
                <p>{productInfo.quantity}</p>
              </div>
            </div>
            <div className="text-sm font-semibold">
              <p>{productInfo.name}</p>
              <p className="text-slate-500">{`${productInfo.size}`}</p>
            </div>
          </div>
          <div className="font-semibold">
            <p>{"$" + productInfo.price}</p>
          </div>
        </div>
      );
    }
  } else {
    return (
      <>
        <p>Cart is Null</p>
      </>
    );
  }
}
