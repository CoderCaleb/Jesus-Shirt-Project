"use client";
import { calculatePrices } from "@/helpers/generalHelpers";
import { User } from "@/types/user";
import React, { useEffect, useState } from "react";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { CartData } from "@/types/product";
import { appearance } from "@/config/checkoutConfig";
import { Elements } from "@stripe/react-stripe-js";
import { fetchHelper } from "@/helpers/fetchHelper";
import CheckoutContent from "@/components/features/checkout/CheckoutContent";
import Loader from "@/components/ui/Loader";

const stripePromise = loadStripe(
  "pk_test_51OOBnGEvVCl2vla10CIfwh6ItUYeeZO4o3haVa9xFHyxwT6ekU8D8wAuA75GsRfGOhMLmU0Znf9dZKJPLNc5xrdq00PVRX8neU",
);

type RequestData = {
  id: string;
  clientSecret: string;
};

const user: User | null = null;
const userToken = null;

export default function CheckoutShipping() {
  const [createPIError, setCreatePIError] = useState<string>("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [checkoutItems, setCheckoutItems] = useState<CartData[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Added loading state

  useEffect(() => {
    // Only run on client-side and fetch checkout items from localStorage
    const storedItems = localStorage.getItem("checkoutItems");
    if (storedItems) {
      setCheckoutItems(JSON.parse(storedItems).checkoutItems);
    }
    setLoading(false); // Set loading to false once localStorage is processed
  }, []); // This runs only once when the component mounts

  useEffect(() => {
    if (checkoutItems && checkoutItems.length > 0) {
      createPaymentIntent(checkoutItems, userToken, user?.uid);
    }
  }, [checkoutItems, userToken]);
  useEffect(() => {
    console.log({
      createPIError,
      clientSecret,
      paymentIntentId,
      checkoutItems,
      loading,
    });
  }, [createPIError, clientSecret, paymentIntentId, checkoutItems, loading]);

  const createPaymentIntent = async (
    checkoutItems: CartData[],
    userToken: string | null,
    uid: string | undefined,
  ) => {
    try {
      console.log("creating payment intent");
      const data = await fetchHelper<RequestData>(
        "http://localhost:4242/create-payment-intent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: { checkoutItems, uid },
        },
      );
      setClientSecret(data.clientSecret);
      setPaymentIntentId(data.id);
    } catch (error) {
      console.error(error);
      setCreatePIError("Failed to checkout your products. Please try again...");
    }
  };

  if (checkoutItems && !checkoutItems.length) {
    return <p>Checkout items are null</p>;
  }

  if (createPIError) {
    return <p className="text-center mt-10">{createPIError}</p>;
  }

  if (loading || !clientSecret || !paymentIntentId) {
    return <Loader />; // Show loader while the state is being initialized
  }

  const options = {
    clientSecret,
    appearance: appearance as StripeElementsOptions["appearance"],
  };

  return (
    <div className="w-full h-full relative">
      <Elements stripe={stripePromise} options={options} key={clientSecret}>
        <div className="w-full h-full overflow-y-scroll flex">
          <CheckoutContent
            checkoutItems={checkoutItems}
            paymentIntentId={paymentIntentId}
          />
        </div>
      </Elements>
    </div>
  );
}
