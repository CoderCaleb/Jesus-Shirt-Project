import React, { useState, useEffect } from "react";
import OrderSummary from "./OrderSummary";
import { useLocation } from "react-router";

export default function TransactionFailedError() {
  const [orderErrorInfo, setOrderErrorInfo] = useState(null);
  const [error, setError] = useState(null);
  const location = useLocation();
  // Extract query parameters
  const params = new URLSearchParams(location.search);
  const orderErrorId = params.get("order-error-id");
  useEffect(() => {
    if (orderErrorId) {
      // Fetch error info from the backend
      fetch(
        `http://127.0.0.1:4242/get-order-error?order-error-id=${orderErrorId}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.orderErrorInfo) {
            fetch(`http://127.0.0.1:4242/get-orders`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              order_items: data.orderErrorInfo.order_items
            }),
          }).then(res=>res.json())
          .then(({order_data,error})=>{
            console.log(data.orderErrorInfo)
            if(error){
              setError(error)
            }
            else{
              data["orderErrorInfo"]["order_items"] = order_data
              console.log("order item data:",order_data,error)
              setOrderErrorInfo(data.orderErrorInfo);
            }
          })
          } else {
            setError(data.error);
          }
        })
        .catch((err) => {
          console.log(err);
          setError("Failed to fetch order error info");
        });
    } else {
      setError("No order error ID provided");
    }
  }, [location.search]);
  return (
    <div className="w-full h-full">
      {!error ? (
        orderErrorInfo ? (
          <div className="w-full h-full flex flex-col ">
            <div className="overflow-x-hidden overflow-y-scroll px-10 py-5">
              <div className="flex flex-col justify-center items-center gap-3 h-full font-semibold text-center mb-7">
                <img
                  src={require("../images/Transaction-Error.png")}
                  alt="transaction-error-img"
                  className=" w-1/4 mb-8 min-w-[400px]"
                ></img>
                <p className="text-4xl font-bold">Oops!</p>
                <p className="font-semibold">
                  Something went wrong with your transaction.
                </p>
                <p className="text-slate-600 font-semibold">
                  Don't worry, your payment has been received and your order has
                  already been logged in our database. Our team is looking into
                  the issue and will email you promptly once the issue is
                  resolved.
                </p>
              </div>
              <div className=" bg-slate-400 w-full h-lineBreakHeight my-4" />

              <div className="ml-3">
                <p className="text-slate-600 font-semibold mb-3">Error Info</p>{" "}
                <div className="flex flex-col gap-2 px-6">
                <p className=" text-black font-semibold">
                  Order Error Id:{" "}
                  <span className="font-semibold text-slate-700 block sm:inline-block">
                    {orderErrorId}
                  </span>
                </p>
                  <p>
                  <p className=" text-black font-semibold">
                  Estimated resolution time:{" "}
                  <span className="font-semibold text-slate-700 block sm:inline-block">
                    {"24-48 hours"}
                  </span>
                </p>
                  </p>
                </div>
              </div>
              <div className=" bg-slate-400 w-full h-lineBreakHeight mt-4 mb-7" />
              <div>
                <OrderSummary
                  orderItems={orderErrorInfo.order_items}
                  shippingPrice={orderErrorInfo.shipping_cost}
                />
              </div>
              <div className=" bg-slate-400 w-full h-lineBreakHeight mt-4 mb-7" />
              <div>
                <p className="font-semibold text-sm text-center">
                  If you have any questions, please contact our support team at{" "}
                  <a href="mailto:support@example.com">support@example.com</a>{" "}
                  or call us at +123-456-7890.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>Loading...</>
        )
      ) : (
        <div>{error}</div>
      )}
    </div>
  );
}
