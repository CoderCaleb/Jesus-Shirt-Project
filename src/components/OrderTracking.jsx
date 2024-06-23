import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router";
import { StateSharingContext } from "../contexts";
import OrderSummary from "./OrderSummary";
import {
  capitalizeFirstLetter,
  formatExpirationDate,
  addDaysToDate,
} from "../utils/helpers";
import { DisplayShippingAddress } from "./DisplayShippingAddress";

const OrderTracking = () => {
  const { orderId } = useParams();
  const [orderInfo, setOrderInfo] = useState({});
  const [paymentData, setPaymentData] = useState({});
  const { user, userToken } = useContext(StateSharingContext);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.uid && userToken) {
      fetchOrderData(orderId, user.uid, userToken);
    }
  }, [userToken, user]);

  const fetchOrderData = async (orderId, uid, token) => {
    try {
      const orderResponse = await fetch(
        `http://127.0.0.1:4242/get-order?orderNumber=${orderId}&uid=${uid}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { orderData, paymentData } = await orderResponse.json();
      const itemsResponse = await fetch(`http://127.0.0.1:4242/get-orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order_items: orderData.order_items }),
      });
      const itemsData = await itemsResponse.json();

      if (itemsData.error) {
        setOrderInfo({ error: itemsData.error });
      } else {
        orderData.order_items = itemsData.order_data;
        setOrderInfo(orderData);
      }
      setPaymentData(paymentData);
    } catch (error) {
      setError(`Error fetching order data: ${error.message}`);
    }
  };

  if (error) {
    return (
      <div className="w-full h-full">
        <p>{error}</p>
      </div>
    );
  }

  if (!orderInfo || Object.keys(orderInfo).length === 0) {
    return (
      <div className="w-full h-full">
        <p>Loading order...</p>
      </div>
    );
  }

  if (orderInfo.error) {
    return (
      <div className="w-full h-full">
        <p>{orderInfo.error}</p>
      </div>
    );
  }

  const timelineStatus = [
    "Order Confirmed",
    "Printing",
    "Out for Delivery",
    "Delivered",
  ];
  const index = timelineStatus.findIndex(
    (value) => value.toLowerCase() === orderInfo.status
  );
  const orderDate = new Date(orderInfo.order_date * 1000); //convert to milliseconds
  const options = { month: "short", day: "2-digit", year: "numeric" };
  const formattedOrderDate = orderDate.toLocaleDateString("en-US", options);

  return (
    <div className="w-full h-full px-7 py-7 overflow-y-scroll">
      <div className="flex mb-5">
        <p className="text-2xl font-semibold">{`Order ID: ${orderId}`}</p>
      </div>
      <div className="flex flex-col gap-4">
        <OrderDetails
          formattedOrderDate={formattedOrderDate}
          estimatedDelivery={"May 16 2022"}
        />
        <OrderTimeline
          timelineStatus={timelineStatus}
          orderDate={orderDate}
          index={index}
        />
      </div>
      <OrderSummary
        orderItems={orderInfo.order_items}
        shippingPrice={orderInfo.shipping_cost}
      />
      <div className=" bg-slate-400 w-full h-lineBreakHeight mb-4" />
      <PaymentAndDeliveryDetails
        paymentData={paymentData}
        orderInfo={orderInfo}
      />
    </div>
  );
};

const OrderDetails = ({ formattedOrderDate, estimatedDelivery }) => (
  <div className="flex gap-3 h-5">
    <p className="text-sm text-slate-600">
      Order date:{" "}
      <span className="font-semibold block sm:inline-block">
        {formattedOrderDate}
      </span>
    </p>
    <div className=" bg-slate-300 h-full w-[2px]" />
    <p className="text-sm text-successGreen font-semibold">
      Estimated delivery:{" "}
      <span className="block sm:inline-block">{estimatedDelivery}</span>
    </p>
  </div>
);

const OrderTimeline = ({ timelineStatus, orderDate, index }) => {
  const options = { month: "short", day: "2-digit", year: "numeric" };
  let prevDate = orderDate;
  const timeStatuses = timelineStatus.map((status, idx) => {
    const currentDate = addDaysToDate(prevDate, idx + 2).toLocaleDateString(
      "en-US",
      options
    );
    prevDate = currentDate;
    return currentDate;
  });

  return (
    <div className="grid w-full md:px-7 mt-7 sm:grid-cols-4 grid-cols-2">
      {timelineStatus.map((status, idx) => (
        <Dot
          key={idx}
          dotStatus={status}
          index={idx}
          currentIndex={index}
          timeStatuses={timeStatuses}
        />
      ))}
    </div>
  );
};

const Dot = ({ dotStatus, index, currentIndex, timeStatuses }) => (
  <div className="flex flex-1 flex-col gap-3 items-center relative" key={index}>
    <p
      className={`font-semibold text-center ${
        index <= currentIndex ? "text-successGreen" : " text-[#9ea7bb]"
      }`}
    >
      {dotStatus}
    </p>
    <div className="flex w-full items-center">
      <div
        className={`flex-1 h-1 ${
          index <= currentIndex ? "bg-successGreen" : "bg-[#9ea7bb]"
        }`}
      ></div>
      <div
        className={`w-5 h-5 rounded-3xl ${
          index <= currentIndex ? "bg-successGreen" : "bg-[#9ea7bb]"
        }`}
      ></div>
      <div
        className={`flex-1 h-1 ${
          index <= currentIndex ? "bg-successGreen" : "bg-[#9ea7bb]"
        }`}
      ></div>
    </div>
    <p className="text-sm text-slate-600 font-semibold">
      {timeStatuses[index]}
    </p>
  </div>
);

const PaymentAndDeliveryDetails = ({ paymentData, orderInfo }) => (
  <div className="flex justify-evenly items-center font-semibold">
    <div className="flex flex-col gap-2">
      <p className="text-lg">Payment</p>
      <div className="flex flex-col text-slate-600 text-sm">
        {paymentData.type === "card" ? (
          <div>
            <p>{capitalizeFirstLetter(paymentData.card.brand)}</p>
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
            <p>{"Payment by " + capitalizeFirstLetter(paymentData.type)}</p>
          </div>
        )}
      </div>
    </div>
    <div className="flex flex-col gap-2">
      <p className="text-lg">Delivery</p>
      <p className="text-slate-600 text-xs">Address</p>
      <DisplayShippingAddress
        address={orderInfo.shipping_address}
        textStyle="text-slate-600"
      />
    </div>
  </div>
);

export default OrderTracking;
