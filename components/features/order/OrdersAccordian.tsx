'use client';

import { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import OrdersTableUI from "./OrdersTable";
import { OrderData } from "@/types/order";

interface OrdersTableProps {
  // optional initial orders if you want to render server-side fallback
  initialOrders?: OrderData[];
}

export default function OrdersAccordian({ initialOrders = [] }: OrdersTableProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [orders, setOrders] = useState<OrderData[]>(initialOrders);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDummy = async () => {
    try {
      const res = await fetch("test-dummy", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // If using SuperTokens manually:
          // Authorization: `Bearer ${await SuperTokens.getAccessToken()}`
        },
      });

      const data = await res.json();
      console.log("Dummy fetch response:", data);
    } catch (err) {
      console.error("Dummy fetch error:", err);
    }
  };

  // Call fetch immediately (or on button click)
  fetchDummy();

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/get-orders-summary`)
      const data : {orders: OrderData[]} = await res.json()
      setOrders(data.orders);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Something went wrong fetching orders"
      );
    } finally {
      setLoading(false);
    }
  };

  // Optionally fetch orders when accordion is expanded
  useEffect(() => {
    if (isExpanded && orders.length === 0) {
      fetchOrders();
    }
  }, [isExpanded]);

  return (
    <div className="border-t border-[#E5E5E5]  max-h-[180px] min-h-[60px] overflow-y-scroll relative">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="sticky z-10 top-0 w-full px-8 py-5 text-left bg-gray-50 text-sm font-medium text-black hover:bg-gray-50 transition-colors flex justify-between items-center"
      >
        <span>View Live Orders</span>
        <FaChevronDown
          size={18}
          className={`text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
        />
      </button>

      {isExpanded && (
        <div className="px-8 py-6">
          {loading && <p className="px-8 py-5">Loading orders...</p>}
          {error && <p className="px-8 py-5 text-red-500">{error}</p>}
          {!loading && !error && <OrdersTableUI orders={orders} />}
        </div>
      )}
    </div>
  );
}