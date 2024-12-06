import { CartData } from "./product";

export type OrderItem = {
  _id?: string; // Optional, MongoDB ObjectId
  id?: string;
  name?: string;
  price?: string;
  product_images?: string[]; // Array of image URLs
  size?: string;
  quantity?: number; // Converted to number for ease of use
};

// Define the OrderData type
export type OrderData = {
  order_number: string; // Required
  status: string; // Required
  order_date: number; // Required
  total_price: string; // Required

  // Optional fields
  _id?: string; // MongoDB ObjectId
  customer?: {
    emailAddress?: string;
    name?: string;
  };
  order_items?: OrderItem[]; // Array of OrderItem objects
  payment_id?: string;
  payment_method?: string;
  shipping_address?: {
    city?: string;
    country?: string;
    line1?: string;
    line2?: string;
    postal_code?: string;
    state?: string;
  };
  shipping_cost?: number; // Converted to number
  linked_user?: string;
  order_token?: string;
  full_order_items?: CartData[];
};

export interface OrderResponse {
  status: "success" | "error";
  state?: string;
  error?: string;
  redirect?: string;
  linkedUserEmail?: string;
  orderData?: {
    orderData: OrderData;
    paymentData: PaymentMethodData;
  };
}

export type PaymentMethodData = {
  type: "card" | "paypal";
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
};
