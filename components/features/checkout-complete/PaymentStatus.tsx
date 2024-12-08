import DisplayShippingAddress from "@/components/ui/DisplayShippingAddress";
import ItemCard from "@/components/ui/ItemCard";
import { CartData } from "@/types/product";
import React from "react";

export default function PaymentStatus({
  paymentIntent,
  orderItemsData,
}: {
  paymentIntent: { [key: string]: any };
  orderItemsData: CartData[];
}) {
  return (
    <div>
      {paymentIntent.status === "succeeded" ? (
        paymentIntent.metadata.orderStatus === "failed" ? (
          <div className="h-72 flex flex-col gap-3 text-center justify-center items-center">
            <p>Oops! Something went wrong with your order.</p>
            <p>Error ID: {paymentIntent.metadata.error_number}</p>
            <p>We encountered an issue while processing your payment.</p>
            <p>
              Please check your payment details or contact support if the
              problem persists.
            </p>
          </div>
        ) : paymentIntent.metadata.orderStatus === "processing" ? (
          <div className="h-72 flex flex-col gap-3 text-center justify-center items-center">
            <p>Your payment was successful!</p>
            <p>Your order is currently being processed.</p>
            <p>
              Thank you for your patience. Please check back shortly for an
              update.
            </p>
          </div>
        ) : (
          <div className="rounded-lg border-slate-300 border-1 text-sm mt-7 w-full">
            <div className="p-3 gap-7 flex">
              <p className="text-slate-500 font-semibold">Order Number</p>
              <p className="text-black">
                {paymentIntent.metadata.order_id ||
                  "Payment failed, no order placed"}
              </p>
            </div>
            <div className="p-3 gap-7 flex">
              <p className="text-slate-500 font-semibold">Contact</p>
              <p className="text-black">{paymentIntent.receipt_email}</p>
            </div>
            <div className="bg-slate-300 w-full h-lineBreakHeight" />
            <div className="p-3 gap-7 flex">
              <p className="text-slate-500 font-semibold">Address</p>
              <div className="flex flex-col gap-2">
                <DisplayShippingAddress
                  address={paymentIntent.shipping?.address}
                  textStyle="text-black"
                />
              </div>
            </div>
            <div className="bg-slate-300 w-full h-lineBreakHeight" />
            <div className="flex pl-3 pt-3">
              <p className="text-slate-500 font-semibold">Items</p>
              <div className="w-full overflow-y-scroll max-h-60">
                {orderItemsData.map((product: CartData, index: number) => (
                  <ItemCard productInfo={product} index={index} key={index} />
                ))}
              </div>
            </div>
          </div>
        )
      ) : paymentIntent.status === "processing" ? (
        <div className="h-72 flex flex-col gap-3 text-center justify-center items-center">
          <p>Your payment is still being processed.</p>
          <p>
            Please do not refresh or close the page. We are finalizing your
            payment.
          </p>
          <p>
            If it takes too long, try reloading the page or check your payment
            method.
          </p>
        </div>
      ) : paymentIntent.status === "requires_payment_method" ? (
        <div className="h-72 flex flex-col gap-3 text-center justify-center items-center">
          <p>Your payment was not successful.</p>
          <p>
            We could not process your payment. Please check your payment details
            or try another method.
          </p>
          <p>If the issue persists, please contact support for assistance.</p>
        </div>
      ) : paymentIntent.status === "requires_action" ? (
        <div className="h-72 flex flex-col gap-3 text-center justify-center items-center">
          <p>It looks like you didn’t complete the checkout process.</p>
          <p>
            Kindly try again and complete the required action to finish the
            checkout.
          </p>
          <p>
            If you&apos;re unsure about the next steps, please contact support for
            assistance.
          </p>
        </div>
      ) : (
        <div className="h-72 flex flex-col gap-3 text-center justify-center items-center">
          <p>Something went wrong.</p>
          <p>
            We encountered an unexpected issue while processing your payment.
          </p>
          <p>
            Please try again later or contact our support team for assistance.
          </p>
        </div>
      )}
    </div>
  );
}
