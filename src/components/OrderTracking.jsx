import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import ItemCard from "./ItemCard";
export default function OrderTracking() {
  const { orderId } = useParams();
  const [orderInfo, setOrderInfo] = useState({});
  const [paymentData, setPaymentData] = useState({});
  useEffect(() => {
    fetch("http://127.0.0.1:4242/get-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderNumber: orderId,
      }),
    })
      .then((res) => res.json())
      .then((orderData) => {
        setOrderInfo(orderData);
        console.log("order data", orderData);
        if (orderData.payment_method) {
          fetch("http://127.0.0.1:4242//get-payment-data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              payment_method_id: orderData.payment_method,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              setPaymentData(data.paymentData);
              console.log(data);
            });
        }
      });
  }, []);
  function capitalizeFirstLetter(str) {
    if (str.length === 0) {
      return str; 
    }
    
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  function formatExpirationDate(expMonth, expYear) {
    const formattedMonth = expMonth < 10 ? `0${expMonth}` : expMonth;
    const formattedYear = expYear.toString().slice(-2);
    const formattedDate = `${formattedMonth}/${formattedYear}`;
    return formattedDate;
  }
  
  function addDaysToDate(date, days) {
    const result = new Date(date); // Create a new Date object to avoid modifying the original date
    result.setDate(result.getDate() + days); // Add the specified number of days to the date
    return result; // Return the new date
  }
  const shippingPrice = 2;
  function calculateProductPrice() {
    const productPrice = orderInfo.order_items.reduce((total, items) => {
      return total + items.price * items.quantity;
    }, 0);
    return Number(productPrice).toFixed(2);
  }
  function calculateTotalPrice() {
    const total =
      parseFloat(calculateProductPrice()) +
      (orderInfo.shipping_cost || shippingPrice);
    return Number(total).toFixed(2);
  }
  const timelineStatus = [
    "Order Confirmed",
    "Printing",
    "Out for Delivery",
    "Delivered",
  ];
  const DisplayShippingAddress = ({ address }) => {
    const renderField = (label, value) => {
      if (value === null || value === "") {
        return null;
      }
      return (
        <p key={label} className="text-sm text-slate-600">
          {value}
        </p>
      );
    };

    return (
      <div>
        {Object.entries(address).map(([key, value]) => {
          return renderField(key, value);
        })}
      </div>
    );
  };
  if (orderInfo) {
    const index = timelineStatus.findIndex((value) => {
      return value.toLowerCase() === orderInfo.status;
    });
    const date = new Date(orderInfo.order_date);
    const options = { month: "short", day: "2-digit", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    if (Object.keys(orderInfo).length !== 0) {
      return (
        <div className="w-full h-full px-7 py-7 overflow-y-scroll">
          <div className="flex mb-5">
            <p className="text-2xl font-semibold">{`Order ID: ${orderId}`}</p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex gap-3 h-5">
              <p className="text-sm text-slate-600">
                Order date:{" "}
                <span className="font-semibold block sm:inline-block">
                  {formattedDate}
                </span>
              </p>
              <div className=" bg-slate-300 h-full w-[2px]" />
              <p className="text-sm text-green-500 font-semibold">
                Estimated delivery:{" "}
                <span className="block sm:inline-block">{"May 16 2022"}</span>
              </p>
            </div>
            <div className=" bg-slate-400 w-full h-lineBreakHeight my-3" />
            <div className="grid w-full md:px-7 mt-7 sm:grid-cols-4 grid-cols-2">
              {timelineStatus.map((value, index) => {
                return (
                  <div className="flex items-end flex-1">
                    <Dot dotStatus={value} index={index} />
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col pl-3 pt-3">
              <p className="text-slate-600 font-semibold">Items</p>
              <div className="w-full overflow-y-scroll h-60 mt-3">
                {orderInfo.order_items.map((product, index) => {
                  return <ItemCard productInfo={product} index={index} />;
                })}
              </div>
            </div>
          </div>
          <div className=" bg-slate-400 w-full h-lineBreakHeight my-4" />
          <div>
            <div className="flex justify-between px-5">
              <p className="text-sm font-semibold text-slate-600 mb-3">Product's price</p>
              <p className="text-sm font-semibold">{`$${calculateProductPrice()} SGD`}</p>
            </div>
            <div className="flex justify-between px-5">
              <p className="text-sm font-semibold text-slate-600">Shipping</p>
              <p className="text-sm font-semibold">{`$${shippingPrice} SGD`}</p>
            </div>
            <div className=" bg-slate-400 w-full h-lineBreakHeight my-3" />
            <div className="flex justify-between px-5 py-3">
              <p className="text-sm font-semibold">Total</p>
              <p className="text-sm font-semibold">{`$${calculateTotalPrice()} SGD`}</p>
            </div>
          </div>
          <div className=" bg-slate-400 w-full h-lineBreakHeight my-4" />
          {Object.keys(paymentData).length !== 0 ? (
            <div className="flex justify-evenly items-center font-semibold">
              <div className="flex flex-col gap-2">
                <p className="text-lg">Payment</p>
                <div className="flex flex-col text-slate-600 text-sm">
                  {paymentData.type === "card" ? (
                    <div>
                      <p className=" ">{capitalizeFirstLetter(paymentData.card.brand)}</p>
                      <p>{"**** **** **** "+paymentData.card.last4}</p>
                      <p>
                        {formatExpirationDate(paymentData.card.exp_month, paymentData.card.exp_year)}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="">
                        {"Payment by "+ capitalizeFirstLetter(paymentData.type)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-lg">Delivery</p>
                <p className=" text-slate-600 text-xs">Address</p>
                <DisplayShippingAddress address={orderInfo.shipping_address} />
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      );
      function Dot(props) {
        let prevValue = date;
        const timeStatuses = timelineStatus.map((value, index) => {
          const currentValue = addDaysToDate(
            prevValue,
            index + 2
          ).toLocaleDateString("en-US", options);
          prevValue = currentValue;
          return currentValue;
        });
        return (
          <div
            className="flex flex-1 flex-col gap-3 items-center relative"
            key={props.index}
          >
            <p
              className={`font-semibold text-center ${
                props.index <= index ? "text-green-500" : " text-slate-400"
              }`}
            >
              {props.dotStatus}
            </p>
            <div className="flex w-full items-center">
              <div
                className={`flex-1 h-1 bg-green-500 ${
                  props.index <= index ? "bg-green-500" : " bg-slate-400"
                }`}
              ></div>
              <div
                className={`w-5 h-5 rounded-3xl ${
                  props.index <= index ? "bg-green-600" : " bg-slate-400"
                }`}
              ></div>
              <div
                className={`flex-1 h-1 bg-green-500 ${
                  props.index <= index ? "bg-green-500" : " bg-slate-400"
                }`}
              ></div>
            </div>
            <p className="text-sm text-slate-600">
              {timeStatuses[props.index]}
            </p>
            <p></p>
          </div>
        );
      }
    } else {
      return (
        <div className="w-full h-full">
          <p>Loading order...</p>
        </div>
      );
    }
  } else {
    return (
      <div className="w-full h-full">
        <p>Order not found.</p>
      </div>
    );
  }
}
