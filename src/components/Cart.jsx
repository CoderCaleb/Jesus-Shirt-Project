// File: Cart.jsx
import React, { useState, useContext, useEffect } from "react";
import { StateSharingContext, HelperFunctionContext } from "../contexts";
import { useNavigate } from "react-router";
import CartBox from "./CartBox";

const CartSummary = ({ prices, cartItems, navigate }) => (
  <div className=" w-4/12 h-min py-6 border-2 border-gray-200 mt-5 rounded-xl hidden lg:block">
    <p className="text-lg font-semibold px-5">Cart Summary</p>
    <div className=" bg-slate-400 w-full h-lineBreakHeight my-4" />
    <div className="flex justify-between px-5">
      <p className="text-sm text-slate-600 mb-3">Product's price</p>
      <p className="text-sm font-semibold">{`$${prices.productPrice} SGD`}</p>
    </div>
    <div className="flex justify-between px-5">
      <p className="text-sm text-slate-600">Shipping</p>
      <p className="text-sm font-semibold">{`$${prices.shippingPrice} SGD`}</p>
    </div>
    <div className=" bg-slate-400 w-full h-lineBreakHeight my-3" />
    <div className="flex justify-between px-5 py-3">
      <p className="text-sm font-semibold">Total</p>
      <p className="text-sm font-semibold">{`$${prices.totalPrice} SGD`}</p>
    </div>
    <div className="pt-5 px-5">
      <button
        className="border-2 w-full h-12 font-semibold rounded-3xl border-black bg-black text-white hover:bg-white hover:text-black"
        onClick={() => {
          navigate("/checkout", { state: { checkoutItems: cartItems, fromCart: true } });
        }}
      >
        Checkout
      </button>
    </div>
  </div>
);

const MobileCartSummary = ({ prices, cartItems, navigate }) => (
  <div className="w-full py-5 bg-white shadow-sm shadow-slate-900 rounded-tl-2xl rounded-tr-2xl">
    <div className="px-5 flex justify-between mb-3">
      <p className="text-sm text-slate-600 mb-3">Product's price</p>
      <p className="text-sm font-semibold">{`$${prices.productPrice} SGD`}</p>
    </div>
    <div className="px-5 flex justify-between">
      <p className="text-sm text-slate-600 mb-3">Shipping</p>
      <p className="text-sm font-semibold">{`$${prices.shippingPrice} SGD`}</p>
    </div>
    <div className=" bg-slate-400 w-full h-lineBreakHeight my-3" />
    <div className="px-5 flex justify-between mb-3">
      <p className="text-sm font-semibold">Total</p>
      <p className="text-sm font-semibold">{`$${prices.totalPrice} SGD`}</p>
    </div>
    <div className="px-5">
      <button
        className="border-2 w-full h-12 font-semibold rounded-3xl border-black bg-black text-white hover:bg-white hover:text-black"
        onClick={() => {
          navigate("/checkout", { state: { checkoutItems: cartItems, fromCart: true } });
        }}
      >
        Checkout
      </button>
    </div>
  </div>
);

const EmptyCartMessage = () => (
  <div className="flex w-full h-full justify-center items-center flex-col gap-5">
    <img
      src={require("../images/empty-cart-img.png")}
      alt="empty cart img"
      className=" w-4/12 max-w-emptyCartImg"
    />
    <p className="text-lg font-semibold">You have no items in your cart</p>
  </div>
);

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, setShowRemoveItem } =
    useContext(StateSharingContext);
  const { calculatePrices } = useContext(HelperFunctionContext);
  const [prices, setPrices] = useState({ productPrice: 0, totalPrice: 0, shippingPrice: 0 });

  useEffect(() => {
    setPrices(calculatePrices(cartItems, 2));
  }, [cartItems, calculatePrices]);

  return (
    <div className="w-full h-full relative">
      <div className="w-full h-full px-10 pt-5 overflow-x-hidden overflow-y-scroll">
        {cartItems.length !== 0 ? (
          <div className="flex w-full">
            <div className="flex gap-3 flex-col w-full lg:w-8/12">
              {cartItems.map((value, index) => (
                <CartBox
                  productData={value}
                  key={index}
                  setShowRemoveItem={setShowRemoveItem}
                />
              ))}
            </div>
            <CartSummary prices={prices} cartItems={cartItems} navigate={navigate} />
          </div>
        ) : (
          <EmptyCartMessage />
        )}
      </div>
      {cartItems.length !== 0 && (
        <div className="lg:hidden absolute bottom-0 w-full left-0">
          <MobileCartSummary prices={prices} cartItems={cartItems} navigate={navigate} />
        </div>
      )}
    </div>
  );
}