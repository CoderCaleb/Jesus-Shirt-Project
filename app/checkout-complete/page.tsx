// app/order-confirmation/page.tsx (Server Component)
import { fetchHelper } from "@/helpers/fetchHelper";
import ItemCard from "@/components/ui/ItemCard";
import DisplayShippingAddress from "@/components/ui/DisplayShippingAddress";
import { CartData } from "@/types/product";
import ClientNavigationButton from "@/components/ui/ClientNavigationButton";
import CheckoutCompleteClient from "@/components/features/checkout-complete/CheckoutCompleteClient";
import { fetchOrderItemsData } from "@/helpers/dataFetchHelpers";

interface PaymentIntentResponse {
  paymentIntent?: { [key: string]: any };
  error?: string;
}

const OrderConfirmationPage = async ({
  searchParams,
}: {
  searchParams: { payment_intent: string; fromCart: string };
}) => {
  const { payment_intent } = await searchParams;

  const paymentIntentData = await fetchPaymentIntent(payment_intent);
  if (!paymentIntentData) {
    return <div>Error fetching payment data</div>;
  }
  const { paymentIntent, error } = paymentIntentData;

  if (error || !paymentIntent) {
    return <div>{error}</div>;
  }

  const {fetchOrderItemsError, orderItemsData} = await fetchOrderItemsData(
    paymentIntent.metadata.order_items
  );

  if (fetchOrderItemsError || !orderItemsData?.order_data) {
    return <div>Error fetching order items</div>;
  }

  return (
    <div className="w-full h-full flex items-center md:w-1/2">
      <div className="w-full flex h-full px-5 sm:px-10 flex-col sm:min-w-[400px] py-5">
        <div className="overflow-y-scroll w-full h-full">
          <p className="text-3xl font-bold my-7">Checkout</p>
          <CheckoutCompleteClient paymentIntent={paymentIntent}/>
          <div className="flex-1">
            {paymentIntent.metadata.orderStatus === "processing" ? (
              <div className="h-72 flex flex-col gap-3 text-center justify-center items-center">
                <p>Your Payment Intent ID: {payment_intent}</p>
                <p>
                  Your order is still being processed. Please try reloading the
                  page.
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
                    {orderItemsData.order_data.map(
                      (product: CartData, index: number) => (
                        <ItemCard
                          productInfo={product}
                          index={index}
                          key={index}
                        />
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="w-full">
            <ClientNavigationButton
              route="/shop"
              buttonText="Continue Shopping"
              additionalStyles="float-right mt-10 w-44"
              buttonType="black"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

async function fetchPaymentIntent(paymentIntentId: string) {
  try {
    const data = await fetchHelper<PaymentIntentResponse>(
      `http://127.0.0.1:4242/retrieve-payment-intent?payment_intent_id=${paymentIntentId}`
    );
    return data;
  } catch (error) {
    console.error("Failed to fetch payment intent", error);
    return { error: "Failed to fetch payment intent" };
  }
}


export default OrderConfirmationPage;
