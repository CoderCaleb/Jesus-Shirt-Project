import { OrderResponse } from "@/types/order";
import { ApiError, fetchHelper } from "./fetchHelper";
import { CartData } from "@/types/product";
import { getAccessToken } from "./serverAuthHelpers";
export async function fetchOrderItemsData(orderItems: string) {
  try {
    const data = await fetchHelper<{ order_data?: CartData[]; error?: string }>(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}
/get-orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: { order_items: orderItems },
      },
    );
    return { orderItemsData: data };
  } catch (error) {
    console.error("Failed to fetch order items", error);
    if (error instanceof ApiError) {
      return {
        fetchOrderItemsError: error.data.error || "Failed to load order items.",
      };
    } else {
      return { fetchOrderItemsError: "An unexpected error occurred" };
    }
  }
}

export async function fetchOrderData(
  orderId: string,
  orderToken?: string | null,
): Promise<OrderResponse> {
  const accessToken = await getAccessToken();

  try {
    const orderResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/get-order?orderNumber=${orderId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Order-Token": orderToken || "",
        },
        cache: "no-store", // Ensure fresh data
      },
    );

    const orderData = await orderResponse.json();

    if (!orderResponse.ok) {
      return {
        status: "error",
        state: orderData.state,
        error: orderData.error,
        redirect: orderData.redirect,
        linkedUserEmail: orderData.linkedUserEmail,
      };
    }

    console.log(orderData);

    return {
      status: "success",
      orderData,
      state: orderData.state,
    };
  } catch (error) {
    return {
      status: "error",
      error: error instanceof Error ? error.message : "Unexpected error",
    };
  }
}
