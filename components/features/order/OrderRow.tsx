// app/orders/OrderRow.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { OrderData } from "@/types/order";
import {
  formatCurrency,
  capitalizeFirstLetter,
} from "@/helpers/generalHelpers";

type OrderRowProps = {
  order: OrderData;
};

export const OrderRow: React.FC<OrderRowProps> = ({ order }) => {
  const router = useRouter();

  return (
    <div
      className="grid md:grid-cols-[3fr_1fr_1fr_1fr] grid-cols-[1fr_1fr_1fr_1fr] cursor-pointer py-4 px-5 justify-between items-center"
      onClick={() => router.push(`/orders/${order.order_number}`)}
    >
      <p>{order.order_number}</p>
      <div>
        <OrderStatusBox status={order.status} />
      </div>
      <p className="text-center text-sm">
        {new Date(order.order_date).toLocaleDateString("en-US", {
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
