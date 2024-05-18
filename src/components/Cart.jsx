import React, { useState, useContext, useEffect } from "react";
import { StateSharingContext, CheckoutContext } from "../App.js";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router";

export default function Cart() {
  const navigate = useNavigate();

  const { cartItems, setCartItems, showRemoveItem, setShowRemoveItem } =
    useContext(StateSharingContext);

  const shippingPrice = 2;
  function calculateProductPrice() {
    const productPrice = cartItems.reduce((total, items) => {
      return total + items.price * items.quantity;
    }, 0);
    return Number(productPrice).toFixed(2);
  }
  function calculateTotalPrice() {
    const total = calculateProductPrice() + shippingPrice;
    return Number(total).toFixed(2);
  }

  return (
    <div className="w-full h-full relative">
      <div className="w-full h-full px-10 pt-5 overflow-x-hidden overflow-y-scroll">
        {cartItems.length !== 0 ? (
          <div className="flex w-full">
            <div className="flex gap-3 flex-col w-full lg:w-8/12">
              {cartItems.map((value, index) => {
                return (
                  <CartBox
                    productData={value}
                    key={index}
                    setShowRemoveItem={setShowRemoveItem}
                  />
                );
              })}
            </div>
            <div className=" w-4/12 h-min py-6 border-2 border-gray-300 mt-5 rounded-xl hidden lg:block">
              <p className="text-lg font-semibold px-5">Cart Summary</p>

              <div className=" bg-slate-400 w-full h-lineBreakHeight my-4" />
              <div className="flex justify-between px-5">
                <p className="text-sm text-slate-600 mb-3">Product's price</p>
                <p className="text-sm font-semibold">{`$${calculateProductPrice()} SGD`}</p>
              </div>
              <div className="flex justify-between px-5">
                <p className="text-sm text-slate-600">Shipping</p>
                <p className="text-sm font-semibold">{`$${shippingPrice} SGD`}</p>
              </div>
              <div className=" bg-slate-400 w-full h-lineBreakHeight my-3" />
              <div className="flex justify-between px-5 py-3">
                <p className="text-sm font-semibold">Total</p>
                <p className="text-sm font-semibold">{`$${calculateTotalPrice()} SGD`}</p>
              </div>
              <div className="pt-5 px-5">
                <button
                  className="border-2 w-full h-12 font-semibold rounded-3xl border-black bg-black text-white hover:bg-white hover:text-black"
                  onClick={() => {
                    navigate("/checkout", {
                      state: { checkoutItems: cartItems, fromCart:true },
                    });
                  }}
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex w-full h-full justify-center items-center flex-col gap-5">
            <img
              src={require("../images/empty-cart-img.png")}
              alt="empty cart img"
              className=" w-4/12 max-w-emptyCartImg"
            />
            <p className="text-lg font-semibold">
              You have no items in your cart
            </p>
          </div>
        )}
      </div>
      {cartItems.length !== 0 ? (
        <div className="lg:hidden absolute bottom-0 w-full left-0">
          <MobileCartSummary />
        </div>
      ) : (
        <></>
      )}
    </div>
  );

  function MobileCartSummary() {
    return (
      <div className="w-full py-5 bg-white rounded-tl-2xl rounded-tr-2xl">
        <div className="px-5 flex justify-between mb-3">
          <p className="text-sm text-slate-600 mb-3">Product's price</p>
          <p className="text-sm font-semibold">{`$${calculateProductPrice()} SGD`}</p>
        </div>
        <div className="px-5 flex justify-between">
          <p className="text-sm text-slate-600 mb-3">Shipping</p>
          <p className="text-sm font-semibold">{`$${shippingPrice} SGD`}</p>
        </div>
        <div className=" bg-slate-400 w-full h-lineBreakHeight my-3" />
        <div className="px-5 flex justify-between mb-3">
          <p className="text-sm font-semibold">Total</p>
          <p className="text-sm font-semibold">{`$${calculateTotalPrice()} SGD`}</p>
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
  }
}

function CartBox(props) {
  const { productData, setShowRemoveItem } = props;
  const { setCartItems } = useContext(StateSharingContext);
  const { name, price, product_images, size, quantity } = productData;

  return (
    <div className=" w-full flex py-5 md:p-5 items-center justify-center px-2">
      <div className="flex md:gap-5 items-center basis-[66.6%] md:basis-auto justify-between">
        <img
          src={product_images[0]}
          className="h-24 w-24 rounded-md"
          alt="product"
        />
        <div className="flex flex-col gap-2 text-center md:basis-auto basis-[50%] md:text-left text-sm sm:text-base">
          <p className={"font-semibold"}>{name}</p>
          <div className="flex gap-3 sm:gap-1 items-center md:justify-start justify-center">
            <p className="text-slate-400">Size:</p>
            <p className="hidden sm:block">{size}</p>
            <div className="block sm:hidden">
              <SizePicker elementSize="10" />
            </div>
          </div>
          <div className="flex-1 block md:hidden">
            <p className="font-semibold">{`$${price} SGD`}</p>
          </div>
        </div>
      </div>
      <div className="flex-1 hidden md:block">
        <p className="font-semibold text-center">{`$${price} SGD`}</p>
      </div>
      <div className="flex max-w gap-3 items-center flex-1 justify-end">
        <p className="text-slate-400 hidden md:block">Quantity:</p>
        <div className="px-2 py-1 rounded-lg w-20 flex justify-between items-center border-slate-300 border-2">
          <p>{quantity}</p>
          <div className="flex flex-col justify-between">
            <IoIosArrowUp
              size={10}
              className="cursor-pointer"
              onClick={() => {
                setCartItems((prev) => {
                  const cartData = [...prev];
                  console.log(cartData);
                  const itemInCartIndex = cartData.findIndex((item) => {
                    return item === productData;
                  });
                  cartData[itemInCartIndex] = {
                    ...cartData[itemInCartIndex],
                    quantity: cartData[itemInCartIndex].quantity + 1,
                  };
                  return cartData;
                });
              }}
            />
            <IoIosArrowDown
              size={10}
              className="cursor-pointer"
              onClick={() => {
                setCartItems((prev) => {
                  const cartData = [...prev];
                  const itemInCartIndex = cartData.findIndex(
                    (items) => productData === items
                  );
                  if (cartData[itemInCartIndex].quantity > 1) {
                    cartData[itemInCartIndex] = {
                      ...cartData[itemInCartIndex],
                      quantity: cartData[itemInCartIndex].quantity - 1,
                    };
                    return cartData;
                  } else {
                    setShowRemoveItem({
                      state: true,
                      productData: productData,
                    });
                    return prev;
                  }
                });
              }}
            />
          </div>
        </div>
        <div className="hidden sm:block">
          <SizePicker elementSize="10" />
        </div>
      </div>
    </div>
  );
  function SizePicker(props) {
    const { elementSize } = props;
    const sizeStyle = `w-${elementSize} h-${elementSize}`;
    const topOffset = elementSize + elementSize / 2;
    return (
      <div
        className={`${sizeStyle} rounded-3xl flex justify-center items-center shadow-md shadow-slate-400 cursor-pointer relative group`}
      >
        <p className="text-sm font-semibold">{size}</p>
        <div
          className={`hidden flex-col absolute w-10 rounded-md shadow-md shadow-slate-400 top-10 group-hover:flex z-10 bg-background`}
        >
          <DropdownChoice
            size="S"
            setCartItems={setCartItems}
            productData={productData}
          />
          <DropdownChoice
            size="M"
            setCartItems={setCartItems}
            productData={productData}
          />
          <DropdownChoice
            size="L"
            setCartItems={setCartItems}
            productData={productData}
          />
          <DropdownChoice
            size="XL"
            setCartItems={setCartItems}
            productData={productData}
          />
          <DropdownChoice
            size="XXL"
            setCartItems={setCartItems}
            productData={productData}
          />
        </div>
      </div>
    );
  }
}

function DropdownChoice(props) {
  const { size, setCartItems, productData } = props;
  return (
    <div
      className="flex items-center justify-center w-full h-10 hover:bg-slate-200"
      onClick={() => {
        setCartItems((prev) => {
          const cartData = [...prev];
          console.log(cartData);
          const itemInCartIndex = cartData.findIndex((item) => {
            return item === productData;
          });
          if (
            !cartData.find(
              (item) => productData.id === item.id && item.size === size
            )
          ) {
            cartData[itemInCartIndex] = {
              ...cartData[itemInCartIndex],
              size: size,
            };
            return cartData;
          } else {
            toast("The size for that shirt is already in cart", {
              type: "error",
            });
            return prev;
          }
        });
      }}
    >
      <p className="text-sm">{size}</p>
    </div>
  );
}
