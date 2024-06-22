import React, { useContext, useState, useEffect } from "react";
import { StateSharingContext } from "../contexts";
import { useNavigate } from "react-router";
import { capitalizeFirstLetter, formatCurrency } from "../utils/helpers";
const Orders = () => {
  const { user, userToken } = useContext(StateSharingContext);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getOrders = async (userToken) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:4242/get-orders-summary?uid=${user.uid}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return await response.json();
    } catch (e) {
      console.error("Failed to fetch orders:", e);
      return null;
    }
  };

  useEffect(() => {
    if (user && userToken) {
      getOrders(userToken).then((orderDataArray) => {
        console.log(orderDataArray)
        if (orderDataArray) {
          setOrders(orderDataArray);
        } else {
          setError("Failed to load orders.");
        }
      });
    }
  }, [userToken, user]);

  return (
    <div className="w-full h-full px-7 py-7 overflow-y-scroll">
      <p className="font-semibold text-2xl mb-8">Your Orders</p>
      <div className="rounded-[10px] w-full border-2 border-gray-200 grid grid-cols-1 font-semibold overflow-y-scroll">
        <div className="grid md:grid-cols-[3fr_1fr_1fr_1fr] grid-cols-[1fr_1fr_1fr_1fr] py-3 px-5 justify-between items-center font-semibold text-sm">
          <span className="inline-block">Order ID</span>
          <span className="inline-block">Status</span>
          <span className="inline-block text-center">Order Date</span>
          <span className="inline-block text-right">Price</span>
        </div>
        <div className=" bg-slate-300 w-full h-lineBreakHeight" />
        {orders.length !== 0 ? (
          orders.map((order, index) => (
            order?
            <OrderRow
              key={index}
              order={order}
              navigate={navigate}
              formatCurrency={formatCurrency}
              capitalizeFirstLetterOfEachWord={capitalizeFirstLetter}
            />:<></>
          ))
        ) : (
          <div className="py-4 px-5 text-center">
            {error ? error : "You have not placed any orders yet."}
          </div>
        )}
      </div>
    </div>
  );
};

const OrderRow = ({ order, navigate, formatCurrency, capitalizeFirstLetterOfEachWord }) => {
  return (
    <div
      className="grid md:grid-cols-[3fr_1fr_1fr_1fr] grid-cols-[1fr_1fr_1fr_1fr] cursor-pointer py-4 px-5 justify-between items-center"
      onClick={() => navigate(`/orders/${order.order_number}`)}
    >
      <p>{order.order_number}</p>
      <div>
      <OrderStatusBox status={order.status} capitalizeFirstLetterOfEachWord={capitalizeFirstLetterOfEachWord} />
      </div>
      <p className="text-center text-sm">
        {new Date(order.order_date*1000).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      <p className="text-right text-sm">{formatCurrency(order.total_price / 100)}</p>
    </div>
  );
};

const OrderStatusBox = ({ status, capitalizeFirstLetterOfEachWord }) => {
  return (
    <div className="rounded-[100px] py-1 px-3 bg-black w-full inline">
      <p className="text-white text-sm inline">
        {capitalizeFirstLetterOfEachWord(status)}
      </p>
    </div>
  );
};

export default Orders;
