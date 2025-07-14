import React, { useState, Dispatch, SetStateAction } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { AddressElement, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import InputField from "@/components/ui/InputField";
import { addressElementOptions } from "@/config/checkoutConfig";
import { checkCheckoutComplete } from "@/helpers/generalHelpers";
import { fetchHelper } from "@/helpers/fetchHelper";
import { CartData } from "@/types/product";
import { StripeAddressElementOptions } from "@stripe/stripe-js";
import ItemCard from "@/components/ui/ItemCard";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "@/components/ui/Button";

// TODO: Make button disabled when loading state

const schema = z.object({
  email: z
    .string()
    .email("Please enter a valid email")
    .min(1, { message: "Please enter your email" }),
});

type FormData = {
  email: string;
};

export default function CheckoutShipping({
  checkoutItems,
  checkoutProgress,
  setCheckoutProgress,
  paymentIntentId,
}: {
  checkoutItems: CartData[];
  checkoutProgress: number;
  setCheckoutProgress: Dispatch<SetStateAction<number>>;
  paymentIntentId: string;
}) {
  const [showItems, setShowItems] = useState<boolean>(false);
  const [isUpdateShippingInfoLoading, setIsUpdateShippingInfoLoading] =
    useState(false);
  const elements = useElements();
  const methods = useForm<FormData>({
    resolver: zodResolver(schema), // This passes Zod validation to React Hook Form
  });

  // Function type definitions
  const handleShowItems = (): void => {
    setShowItems((prev) => !prev);
  };

  const handleContinueToPayment = async (
    emailData: FormData,
  ): Promise<void> => {
    const addressElement = elements?.getElement("address");
    if (!addressElement) {
      toast.error("An unexpected error occurred. Please try again");
      return;
    }
    setIsUpdateShippingInfoLoading(true);

    addressElement.getValue().then(async function (shippingData) {
      if (shippingData.complete) {
        try {
          await fetchHelper(`${process.env.NEXT_PUBLIC_SERVER_API_URL}
/update-payment-intent`, {
            method: "PUT",
            body: {
              payment_intent_id: paymentIntentId,
              shipping: shippingData.value,
              receipt_email: emailData.email,
            },
          });
          new Promise((resolve) => setTimeout(resolve, 2000));
          setCheckoutProgress(2);
        } catch (err) {
          toast.error(
            "Failed to update shipping info to order. Please try again",
          );
          console.error(err);
        } finally {
          setIsUpdateShippingInfoLoading(false);
        }
      } else {
        setIsUpdateShippingInfoLoading(false);
        toast(
          "Please double-check your inputs. Make sure all fields are filled out and correctly formatted.",
          {
            type: "error",
          },
        );
      }
    });
  };

  const handleEmailError = () => {
    toast.error("Kindly check the format of your email address.");
  };

  return (
    <FormProvider {...methods}>
      <div className="w-full h-full md:w-1/2 overflow-y-scroll">
        <form
          onSubmit={methods.handleSubmit(
            handleContinueToPayment,
            handleEmailError,
          )}
        >
          <div className="w-full h-full flex items-center relative justify-center flex-col px-3 sm:px-10 sm:min-w-[400px] py-5">
            {showItems && (
              <div className="w-full h-full overflow-y-scroll absolute bg-slate-200 z-30 md:hidden animate-fade-up">
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
                {checkoutItems.map((product, index) => (
                  <ItemCard productInfo={product} key={index} index={index} />
                ))}
              </div>
            )}
            <div className="flex flex-col gap-3 w-full overflow-y-scroll">
              <div className="font-semibold flex justify-between text-lg md:text-xl mb-10 w-full">
                <p className="flex-1">How do you want to get your order?</p>
              </div>
              <div
                className="text-base font-semibold flex absolute gap-2 items-center cursor-pointer md:hidden top-5 right-5"
                onClick={handleShowItems}
              >
                <p>My Order</p>
                <FaChevronDown />
              </div>
              <div>
                <InputField
                  name="email"
                  label="Email Address"
                  placeholder="Enter your email"
                />
              </div>
              <div id="address-div" className="w-full">
                <AddressElement
                  id="address-element"
                  options={addressElementOptions as StripeAddressElementOptions}
                />
              </div>
              <Button
                buttonText="Continue to payment"
                buttonType="black"
                additionalStyles="w-full h-12 min-h-[3rem] font-semibold rounded-xl mt-5"
                isDisabled={isUpdateShippingInfoLoading}
                type="submit"
              />

              <div className="flex gap-5 w-full px-5 mb-5 mt-12">
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
        </form>
      </div>
    </FormProvider>
  );
}
