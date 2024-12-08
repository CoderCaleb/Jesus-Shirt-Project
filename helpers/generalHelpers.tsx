import { CartData } from "@/types/product";

export const calculatePrices = (
  products: CartData[],
  shippingPrice: number
) => {
  const shippingPriceNumber = Number(shippingPrice);
  const productPrice = products
    .reduce(
      (total, item) => total + Number(item.price) * Number(item.quantity),
      0
    )
    .toFixed(2);
  const totalPrice = (Number(productPrice) + shippingPriceNumber).toFixed(2);
  const formattedShippingPrice = shippingPriceNumber.toFixed(2);
  return {
    productPrice,
    totalPrice,
    shippingPrice: formattedShippingPrice,
  };
};

export const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const formatCurrency = (amount: number | string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount));
};

export const checkCheckoutComplete = (
  number: number,
  checkoutProgress: number
) => checkoutProgress >= number;

import { fetchHelper } from "./fetchHelper";

interface AddUserRequestBody {
  email: string;
  orderNumber: string;
  orderToken: string;
  state: string;
}

interface AddUserResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const handleAddingUser = async (
  orderToken?: string,
  orderId?: string,
  state?: string
): Promise<{ data?: AddUserResponse; error?: string }> => {
  try {
    const url = "http://localhost:4242/add-user";
    const data = await fetchHelper<AddUserResponse>(url, {
      method: "POST",
      headers: {
        "Order-Token": orderToken ? orderToken : "null",
      },
      body: {
        orderNumber: orderId,
        orderToken,
        state,
      } as AddUserRequestBody,
    });

    return { data };
  } catch (error:unknown) {
    console.error(error)
    return {
      error:
        "We couldn’t complete your sign-up at the moment. Please try again or reach out to us for assistance—we’re here to help!",
    };
  }
};

export function capitalizeFirstLetter(str: string) {
  if (str.length === 0) {
    return str;
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function addDaysToDate(date: string, days: number) {
  const result = new Date(date); // Create a new Date object to avoid modifying the original date
  result.setDate(result.getDate() + days); // Add the specified number of days to the date
  return result; // Return the new date
}

type SendOrderLinkResponse = {
  message: string;
};

export async function sendOrderLink(email: string, orderNumber: string) {
  await fetchHelper<SendOrderLinkResponse>(
    "http://localhost:4242/send-order-link",
    {
      method: "POST",
      body: { email, orderNumber },
    }
  );
}
