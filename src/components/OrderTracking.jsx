import React, { useEffect, useState, useContext } from "react";
import { useLocation, useParams } from "react-router";
import ItemCard from "./ItemCard";
import { StateSharingContext, HelperFunctionContext } from "../App";
import OrderSummary from "./OrderSummary";
export default function OrderTracking() {
  const { orderId } = useParams();
  const [orderInfo, setOrderInfo] = useState({});
  const [paymentData, setPaymentData] = useState({});
const { user, userToken } = useContext(StateSharingContext);
  
  useEffect(() => {
    if (user &&user.uid && userToken) {
      console.log("Fetching from backend");
      fetch(`http://127.0.0.1:4242/get-order?orderNumber=${orderId}&uid=${user.uid}`,{
      method: 'GET',
      headers: {
          'Authorization': `Bearer ${userToken}`
        }
    })
      .then((res) => res.json())
      .then((orderData) => {
        console.log(orderData);
        setOrderInfo(orderData.orderData);
          setPaymentData(orderData.paymentData);
            });
        }
      }, [userToken, user]);
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
      if (!orderInfo.error) {
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
                    <div className="flex items-end flex-1" key={index}>
                      <Dot dotStatus={value} index={index} />
                    </div>
                  );
                })}
              </div>
            </div>
            <OrderSummary orderItems={orderInfo.order_items} shippingPrice={orderInfo.shipping_cost}/>
            <div className=" bg-slate-400 w-full h-lineBreakHeight my-4" />
            {paymentData && Object.keys(paymentData).length !== 0 ? (
              <div className="flex justify-evenly items-center font-semibold">
                <div className="flex flex-col gap-2">
                  <p className="text-lg">Payment</p>
                  <div className="flex flex-col text-slate-600 text-sm">
                    {paymentData.type === "card" ? (
                      <div>
                        <p className=" ">
                          {capitalizeFirstLetter(paymentData.card.brand)}
                        </p>
                        <p>{"**** **** **** " + paymentData.card.last4}</p>
                        <p>
                          {formatExpirationDate(
                            paymentData.card.exp_month,
                            paymentData.card.exp_year
                          )}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="">
                          {"Payment by " +
                            capitalizeFirstLetter(paymentData.type)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-lg">Delivery</p>
                  <p className=" text-slate-600 text-xs">Address</p>
                  <DisplayShippingAddress
                    address={orderInfo.shipping_address}
                  />
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
            <p>{orderInfo.error}</p>
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
