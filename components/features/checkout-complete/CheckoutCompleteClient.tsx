"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CiCircleCheck, CiCircleRemove } from "react-icons/ci";

export default function CheckoutCompleteClient({
  paymentIntent,
}: {
  paymentIntent: { [key: string]: any };
}) {
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fromCart = JSON.parse(
      localStorage.getItem("checkoutItems") || "{}",
    )?.fromCart;

    const handlePaymentIntentInfo = (paymentIntent: { [key: string]: any }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          if (paymentIntent.metadata.orderStatus === "failed") {
            if (paymentIntent.metadata.error_number) {
              router.push(
                `/transaction-error?orderErrorId=${paymentIntent.metadata.error_number}`,
              );
            }
          } else if (paymentIntent.metadata.orderStatus === "processing") {
            //setMessage("Order is processing");
          } else {
            toast.success("Payment succeeded!");
            if (fromCart) {
              localStorage.setItem("cartItems", "[]");
            }
            localStorage.setItem("checkoutItems", "[]");
          }
          break;
        case "processing":
          setMessage("Your payment is processing.");
          toast.info("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Payment not successful");
          toast.error("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          toast.error("Something went wrong");
          break;
      }
    };
    handlePaymentIntentInfo(paymentIntent);
  });

  return (
    <div className="flex items-center gap-2">
      {!message ? <CiCircleCheck size={45} /> : <CiCircleRemove size={45} />}
      <div className="flex flex-col">
        <p className="text-lg font-bold">{message ? message : "Thank you"}</p>
        <p className="text-sm">{paymentIntent.shipping?.name}</p>
      </div>
    </div>
  );
}
