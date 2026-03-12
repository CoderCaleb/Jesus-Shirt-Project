// components/orders/OrdersTableUI.tsx
import { useEffect } from "react";
import { OrderRow } from "./OrderRow";
import { OrderData } from "@/types/order";

interface OrdersTableUIProps {
  orders: OrderData[];
  ordersClickable?: boolean;
  ordersCopyable?: boolean;
}

export default function OrdersTableUI({ orders, ordersClickable=false, ordersCopyable=false }: OrdersTableUIProps) {
  if(!orders) return <p>{`Please sign in at ${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}/auth?role=tester to access your orders`}</p>
  if (orders.length === 0) return <p>No orders have been placed yet.</p>;

  return (
    <div className="rounded-[10px] w-full border-2 border-gray-200 grid grid-cols-1 font-semibold overflow-y-scroll">
      <div className="grid md:grid-cols-[3fr_1fr_1fr_1fr] grid-cols-[1fr_1fr_1fr_1fr] py-3 px-5 justify-between items-center font-semibold text-sm">
        <span>Order ID</span>
        <span>Status</span>
        <span className="text-center">Order Date</span>
        <span className="text-right">Price</span>
      </div>
      <div className="bg-slate-300 w-full h-lineBreakHeight" />
      {orders.map((order) => (
        <OrderRow key={order.order_number} order={order} ordersClickable={ordersClickable} ordersCopyable={ordersCopyable}/>
      ))}
    </div>
  );
}