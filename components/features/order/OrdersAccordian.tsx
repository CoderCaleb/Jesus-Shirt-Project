'use client';

import { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import OrdersTableUI from "./OrdersTable";
import { OrderData } from "@/types/order";
import { fetchHelper } from "@/helpers/fetchHelper";

interface OrdersTableProps {
  // optional initial orders if you want to render server-side fallback
  initialOrders?: OrderData[];
  ordersClickable?: boolean;
  ordersCopyable?: boolean;
}

export default function OrdersAccordian({ initialOrders = [], ordersClickable = false, ordersCopyable = false }: OrdersTableProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [orders, setOrders] = useState<OrderData[]>(initialOrders);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const data: { orders: OrderData[] } = await fetchHelper(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/get-orders-summary`)
      setOrders(data.orders);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(
          err.message == "unauthorised" ? "" : err.message
        );
      }
      else {
        setError(
          "Something went wrong fetching orders"
        )
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("ORDERS", orders)
  }, [orders])

  // Optionally fetch orders when accordion is expanded
  useEffect(() => {
    if (isExpanded && orders && orders.length === 0) {
      fetchOrders();
    }
  }, [isExpanded]);

  return (
    <div className="border-t border-[#E5E5E5] max-h-[180px] min-h-[60px] overflow-y-scroll relative">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="sticky z-10 top-0 w-full px-8 py-5 text-left bg-gray-50 text-sm font-medium text-black hover:bg-gray-50 transition-colors flex justify-between items-center"
      >
        <span>View Live Orders</span>
        <FaChevronDown
          size={18}
          className={`text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""
            }`}
        />
      </button>

      {isExpanded && (
        <div className="px-8 py-6">
          {loading && <p className="px-8 py-5">Loading orders...</p>}

          {error && (
            <p className="px-8 py-5 text-red-500">
              {error === "unauthorised" ? (
                <>
                  <span className="px-8 py-5 text-gray-500 text-sm">
                    No live orders yet.{" "}
                    <a
                      href={`${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}/auth?role=tester`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Sign up as a tester
                    </a>{" "}
                    to access preconfigured demo orders.
                  </span>
                </>
              ) :
                error
              }
            </p>
          )}

          {!loading && !error && orders.length === 0 && (
            <p className="px-8 py-5 text-gray-500 text-sm">
              No live orders yet.{" "}
              <a
                href={`${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}/shop`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Go to /shop
              </a>{" "}
              to create orders
            </p>
          )}

          {!loading && !error && orders.length > 0 && (
            <OrdersTableUI
              orders={orders}
              ordersClickable={ordersClickable}
              ordersCopyable={ordersCopyable}
            />
          )}
        </div>
      )}
    </div>
  );
}