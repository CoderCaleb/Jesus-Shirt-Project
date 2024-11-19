import { ApiError, fetchHelper } from "./fetchHelper";
import { CartData } from "@/types/product";
export async function fetchOrderItemsData(orderItems: string) {
    try {
      const data = await fetchHelper<{ order_data?: CartData[]; error?: string }>(
        "http://127.0.0.1:4242/get-orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: { order_items: orderItems },
        }
      );
      return {orderItemsData:data};
    } catch (error) {
      console.error("Failed to fetch order items", error);
      if(error instanceof ApiError){
        return { fetchOrderItemsError: error.data.error || "Failed to load order items." };
      }
      else{
        return {fetchOrderItemsError:"An unexpected error occurred"}
      }
    }
  }