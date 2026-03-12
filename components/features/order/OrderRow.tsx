// app/orders/OrderRow.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { OrderData } from "@/types/order";
import {
  formatCurrency,
  capitalizeFirstLetter,
} from "@/helpers/generalHelpers";
import { FiCopy } from "react-icons/fi";
import { TiTick } from "react-icons/ti";

type OrderRowProps = {
  order: OrderData;
  ordersClickable?: boolean;
  ordersCopyable?: boolean
};

export const OrderRow: React.FC<OrderRowProps> = ({ order, ordersClickable=false, ordersCopyable=false}) => {
  const router = useRouter();
    const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(order.order_number);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1200); // how long the tick shows
  };

  return (
    <div
      className="grid md:grid-cols-[3fr_1fr_1fr_1fr] grid-cols-[1fr_1fr_1fr_1fr] cursor-pointer py-4 px-5 justify-between items-center"
      onClick={ordersClickable?() => router.push(`/orders/${order.order_number}`):()=>{}}
    >
      <div className="flex gap-3">
      <p>{order.order_number}</p>

      {ordersCopyable && (
        <button
          onClick={handleCopy}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-100"
          aria-label="Copy order number"
        >
          {copied ? (
            <TiTick size={18} className="text-green-500" />
          ) : (
            <FiCopy size={16} />
          )}
        </button>
      )}
      </div>
      <div>
        <OrderStatusBox status={order.status} />
      </div>
      <p className="text-center text-sm">
        {new Date(order.order_date * 1000).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      <p className="text-right text-sm">
        {formatCurrency(Number(order.total_price) / 100)}
      </p>
    </div>
  );
};

const OrderStatusBox: React.FC<{
  status: string;
}> = ({ status }) => {
  return (
    <div className="rounded-[100px] py-1 px-3 bg-black w-full inline">
      <p className="text-white text-sm inline">
        {capitalizeFirstLetter(status)}
      </p>
    </div>
  );
};
