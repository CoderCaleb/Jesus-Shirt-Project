import React, { Dispatch, SetStateAction, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { FaChevronDown } from "react-icons/fa6";
import { AiOutlineCloseCircle } from "react-icons/ai";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "react-toastify";

import ItemCard from "@/components/ui/ItemCard";
import MessageBox from "@/components/ui/MessageBox";
import { checkCheckoutComplete } from "@/helpers/generalHelpers";
import { CartData } from "@/types/product";
import { StripePaymentElementOptions } from "@stripe/stripe-js";
import LoadingOverlay from "./LoadingOverlay";
import Button from "@/components/ui/Button";

export default function CheckoutPayment({
  checkoutItems,
  checkoutProgress,
  setCheckoutProgress,
}: {
  checkoutItems: CartData[];
  checkoutProgress: number;
  setCheckoutProgress: Dispatch<SetStateAction<number>>;
}) {
  const [showItems, setShowItems] = useState(false);
  const [paymentError, setPaymentError] = useState<string | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const paymentElementOptions = {
    layout: "tabs",
  };

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    setIsLoading(true);
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `http://localhost:3000/checkout-complete`,
        },
      });

      if (error) {
        console.error(error);
        toast.error(error.message);
        setPaymentError(error.message);
      }
    } catch (error) {
      console.error("Payment confirmation failed:", error);
      toast.error("Payment confirmation failed");
      setPaymentError("Payment confirmation failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full md:w-1/2">
      {isLoading && <LoadingOverlay />}
      <div className="w-full h-full">
        <div className="w-full h-full flex items-center relative justify-center flex-col px-3 sm:px-10 sm:min-w-[400px] py-5">
          {showItems && (
            <div
              className={`w-full h-full overflow-y-scroll absolute bg-slate-200 md:hidden animate-fade-up`}
            >
              <div className="flex items-center mx-5">
                <p className="text-3xl font-semibold sm:text-left text-center flex-1 my-5">
                  Your Orders 🛒
                </p>
                <AiOutlineCloseCircle
                  size={40}
                  className="cursor-pointer"
                  onClick={() => setShowItems(false)}
                />
              </div>
              <div className="overflow-y-scroll z-40">
                {checkoutItems.map((product, index) => (
                  <ItemCard productInfo={product} key={index} index={index} />
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-col gap-3 w-full overflow-y-scroll">
            <div className="font-semibold flex items-center justify-between gap-3 text-lg md:text-xl mb-10 w-full">
              <IoMdArrowBack
                size={22}
                className="cursor-pointer"
                onClick={() => setCheckoutProgress(1)}
              />
              <p className="flex-1">How do you want your order?</p>
            </div>
            <div
              className="text-base font-semibold flex absolute gap-2 items-center cursor-pointer md:hidden top-5 right-5"
              onClick={() => setShowItems((prev) => !prev)}
            >
              <p>My Order</p>
              <FaChevronDown />
            </div>
            <div id="payment-div" className="w-[99%] m-auto">
              <PaymentElement
                id="payment-element"
                options={paymentElementOptions as StripePaymentElementOptions}
              />
            </div>
            {paymentError && <MessageBox type="error" message={paymentError} />}
            <div className="flex flex-col gap-3 w-full">
              <Button
                buttonText="Checkout"
                buttonType="black"
                additionalStyles="mt-5"
                isDisabled={isLoading || !stripe || !elements}
                onClick={handlePayment}
              />
            </div>
            <div className="flex gap-5 w-full px-5 mt-7">
              <div className="flex-col flex-1 flex">
                <p
                  className={`font-semibold ${
                    checkCheckoutComplete(1, checkoutProgress)
                      ? "text-black"
                      : "text-slate-400"
                  }`}
                >
                  Shipping
                </p>
                <div
                  className={`flex-1 rounded-xl mt-1 h-2 ${
                    checkCheckoutComplete(1, checkoutProgress)
                      ? "bg-black"
                      : "bg-slate-300"
                  }`}
                />
              </div>
              <div className="flex-col flex-1 gap-2">
                <p
                  className={`font-semibold ${
                    checkCheckoutComplete(2, checkoutProgress)
                      ? "text-black"
                      : "text-slate-400"
                  }`}
                >
                  Payment
                </p>
                <div
                  className={`flex-1 rounded-xl mt-1 h-2 ${
                    checkCheckoutComplete(2, checkoutProgress)
                      ? "bg-black"
                      : "bg-slate-300"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
