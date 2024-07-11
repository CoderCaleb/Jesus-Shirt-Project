import React, { useEffect, useState, useContext } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import { StateSharingContext } from "../contexts";
import OrderSummary from "./OrderSummary";
import { useSearchParams } from "react-router-dom";

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
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const orderToken = searchParams.get("order_token");

  useEffect(() => {
    const userIsLoading = user === null;
    const isSignedIn = user && user.uid && userToken;

    console.log(
      "user loading:",
      userIsLoading,
      "signed in:",
      isSignedIn,
      "user:",
      user
    );

    if (userIsLoading) {
      return;
    }
    if (!orderToken) {
      fetchOrderData(orderId, user.uid, userToken).then((orderResponse) => {
        if (orderResponse.status === "error") {
          console.log(orderResponse);
          handleFetchOrderDataErrorNoOrderToken(orderResponse);
        } else {
          handleFetchOrderDataSuccessNoOrderToken(orderResponse);
        }
      });
    } else {
      fetchOrderData(orderId, user.uid, userToken).then((orderResponse) => {
        if (orderResponse.status === "error") {
          console.log(orderResponse);
          handleFetchOrderDataErrorWithOrderToken(orderResponse);
        } else {
          handleFetchOrderDataSuccessWithOrderToken(orderResponse);
        }
      });
    }
  }, [userToken]);

  const handleUserNotSignedIn = (linkedUser) => {
    navigate(
      `/login?from=order-tracking&state=not-authenticated-no-order-token`
    );
  };

  async function fetchOrderData(orderId, uid, token) {
    const orderResponse = await fetch(
      `http://127.0.0.1:4242/get-order?orderNumber=${orderId}&uid=${uid}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Order-Token': orderToken
        }
      }
    )

    const orderData = await orderResponse.json();

    if (!orderResponse.ok) {
      return {
        status: "error",
        errorInfo: { error: orderData.error, statusCode: orderResponse.status },
        statuses: orderData.statuses,
        orderTokenVerified: orderData.orderTokenVerified,
        linkedUserEmail: orderData.linkedUserEmail
      };
    }
    console.log("order items", orderData);
    const orderItemsResponse = await fetch(`http://127.0.0.1:4242/get-orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ order_items: orderData["orderData"].order_items }),
    });

    const orderItemsData = await orderItemsResponse.json();

    if (!orderItemsResponse.ok) {
      return {
        status: "error",
        errorInfo: {
          error: orderItemsData.error,
          statusCode: orderItemsResponse.status,
        },
      };
    }

    orderData["orderData"]["full_order_items"] = orderItemsData.order_data;

    return {
      status: "success",
      orderData,
      orderItemsData,
    };
  }

  //everything under here means userToken auth is successful
  const handleFetchOrderDataSuccessNoOrderToken = (orderResponse) => {
    const { orderData, paymentData, orderTokenVerified } =
      orderResponse.orderData;
    console.log("orderTokenVerified:", orderTokenVerified, orderData);
    setOrderInfo(orderData);
    setPaymentData(paymentData);
  };

  const handleFetchOrderDataSuccessWithOrderToken = (orderResponse) => {
    const { orderData, paymentData, orderTokenVerified } =
      orderResponse.orderData;
    console.log("orderTokenVerified:", orderTokenVerified, orderData);
    //orderToken and userToken is verified
    if (orderTokenVerified === "token-verified") {
      if (orderData.linked_user) {
        //navigate(`/login?from=order-tracking&state=authenticated-order-token-verified&linked_user=${orderData.linked_user}`);
        setOrderInfo(orderData);
        setPaymentData(paymentData);
      }
    } else if (orderTokenVerified === "token-invalid") {
      setError("Order token verification failed");
    }
  };

  const handleFetchOrderDataErrorWithOrderToken = (orderResponse) => {
    const { status, errorInfo, statuses, orderTokenVerified, linkedUserEmail } = orderResponse;
    const { error, statusCode } = errorInfo;
    const {
      userAuthenticated,
      linkedUserMatchesUserUID,
      userHaveOrder,
      hasLinkedUser,
    } = statuses?statuses:{};
    console.log(orderResponse);
    console.log("orderTokenVerifiedFromError", orderTokenVerified);

    if (orderTokenVerified === "token-invalid") {
      setError("Order token not valid");
      return;
    }
    const handleAuthError = () => {
      // User is authenticated
      if (userAuthenticated) {
        if (hasLinkedUser) {
          // User is authenticated and the order is linked to the user's account
          if (linkedUserMatchesUserUID && userHaveOrder) {
            console.log("Never going to reach here since it is error function");
          } else {
            // User authenticated, order linked user does not match signed in user
            navigate(`/login?from=order-tracking&state=authenticated-order-not-in-user-linked-user-not-matched&orderId=${orderId}&orderToken=${orderToken}&linkedUserEmail=${linkedUserEmail}`);
          }
        } else {
          // User is authenticated but no linked user for the order
          navigate(`/signup?from=order-tracking&state=authenticated-no-linked-user&orderId=${orderId}&orderToken=${orderToken}`);
        }
      } else {
        // User is not authenticated
        if (hasLinkedUser) {
          // Order is linked to a user but the current user is not signed in
          navigate(`/login?from=order-tracking&state=not-authenticated-has-linked-user&orderId=${orderId}&orderToken=${orderToken}&linkedUserEmail=${linkedUserEmail}`);
        } else {
          // User not authenticated and no linked user for the order
          navigate(`/signup?from=order-tracking&state=not-authenticated-no-linked-user&orderId=${orderId}&orderToken=${orderToken}`);
        }
      }
    };
    

    handleErrors(statusCode, handleAuthError);
  };

  const handleFetchOrderDataErrorNoOrderToken = (orderResponse) => {
    const { errorInfo, statuses } = orderResponse;
    const { statusCode } = errorInfo;
    const {
      hasLinkedUser,
    } = statuses?statuses:{};
    const handleAuthError = () => {
      if(hasLinkedUser){
        navigate(
          `/login?from=order-tracking&state=authenticated-failed-no-order-token&orderId=${orderId}&orderToken=${orderToken}`
        );
      }
      else{
        setError("Need order token to authenticate")
      }
    };    
    handleErrors(statusCode, handleAuthError);
  };

  const handleErrors = (statusCode, handleAuthError) => {
    if (statusCode >= 401 && statusCode <= 403) {
      handleAuthError();
    } else {
      if (statusCode === 404) {
        console.error("Order not found");
        setError("Order not found");
      } else if (statusCode >= 500) {
        console.error("Server error, please try again later");
        setError("Server error, please try again later");
      } else {
        console.error("An unknown error occurred");
        setError(error ? error : "An unknown error occurred");
      }
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
        orderItems={orderInfo.full_order_items}
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
