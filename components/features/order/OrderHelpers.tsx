// components/orders/OrdersHelpers.ts
import { fetchHelper } from "@/helpers/fetchHelper";
import { getAccessToken, getSSRSessionHelper } from "@/helpers/serverAuthHelpers";
import { redirect } from "next/navigation";
import { OrderData } from "@/types/order";

export type OrdersResponse = { orders: OrderData[] };

export async function fetchOrders(): Promise<OrdersResponse> {
  const url = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/get-orders-summary`;
  const accessToken = await getAccessToken();
  return fetchHelper<OrdersResponse>(url, {
    customConfig: { cache: "no-cache" },
    headers: { Authorization: "Bearer " + accessToken },
  });
}

export async function getOrdersWithSession() {
  const { accessTokenPayload, hasToken, error } = await getSSRSessionHelper();

  if (error) throw new Error(`Session error: ${error.message}`);
  if (!accessTokenPayload) {
    if (!hasToken) redirect("/auth");
    throw new Error("Token refresh required");
  }

  const orders = await fetchOrders();
  return orders;
}