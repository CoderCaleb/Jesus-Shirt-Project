import { fetchHelper } from "@/helpers/fetchHelper";
import { OrderRow } from "./OrderRow";
import { OrderData } from "@/types/order";
import { TryRefreshComponent } from "@/components/utility/tryRefreshClientComponent";
import {
  getAccessToken,
  getSSRSessionHelper,
} from "@/helpers/serverAuthHelpers";
import { redirect } from "next/navigation";

type OrdersResponse = { orders: OrderData[] };

async function fetchOrders(): Promise<OrdersResponse> {
  const url = `http://127.0.0.1:4242/get-orders-summary`;
  const accessToken = await getAccessToken();
  return fetchHelper<OrdersResponse>(url, {
    customConfig: { cache: "no-cache" },
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
}

export default async function OrdersContent() {
  const { accessTokenPayload, hasToken, error } = await getSSRSessionHelper();

  if (error) {
    return (
      <div>
        Something went wrong while trying to get the session. Error -{" "}
        {error.message}
      </div>
    );
  }

  if (accessTokenPayload === undefined) {
    if (!hasToken) {
      return redirect("/auth");
    }

    return <TryRefreshComponent key={Date.now()} />;
  }

  try {
    const ordersResponse = await fetchOrders();
    console.log("ORDERS RESPONSE:", ordersResponse);

    if (ordersResponse.orders.length === 0) {
      return <p>No orders have been placed yet.</p>;
    }

    return (
      <div className="rounded-[10px] w-full border-2 border-gray-200 grid grid-cols-1 font-semibold overflow-y-scroll">
        <div className="grid md:grid-cols-[3fr_1fr_1fr_1fr] grid-cols-[1fr_1fr_1fr_1fr] py-3 px-5 justify-between items-center font-semibold text-sm">
          <span className="inline-block">Order ID</span>
          <span className="inline-block">Status</span>
          <span className="inline-block text-center">Order Date</span>
          <span className="inline-block text-right">Price</span>
        </div>
        <div className="bg-slate-300 w-full h-lineBreakHeight" />
        {ordersResponse.orders.map((order) => (
          <OrderRow key={order.order_number} order={order} />
        ))}
      </div>
    );
  } catch (e) {
    return (
      <p>
        Something went wrong when fetching order data. Please try again later
      </p>
    );
  }
}
