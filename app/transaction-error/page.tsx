import { fetchOrderItemsData } from "@/helpers/dataFetchHelpers";
import { ApiError, fetchHelper } from "@/helpers/fetchHelper";
import { CartData } from "@/types/product";
import OrderSummary from "@/components/ui/OrderSummary/OrderSummary";
import Image from "next/image";

const TransactionFailedError = async ({
  searchParams,
}: {
  searchParams: { orderErrorId: string };
}) => {
  const { orderErrorId } = await searchParams;

  const { fetchErrorDataError, errorData } =
    await fetchOrderErrorData(orderErrorId);
  if (fetchErrorDataError || !errorData?.orderErrorInfo) {
    return <div>{fetchErrorDataError || "Order error data not found."}</div>;
  }

  const { fetchOrderItemsError, orderItemsData } = await fetchOrderItemsData(
    errorData.orderErrorInfo.order_items,
  );
  if (fetchOrderItemsError || !orderItemsData?.order_data) {
    return <div>{fetchOrderItemsError || "Failed to load order items."}</div>;
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="overflow-x-hidden overflow-y-scroll px-10 py-5">
        <ErrorInfo orderErrorId={orderErrorId} />
        <OrderSummary
          orderItems={orderItemsData.order_data}
          shippingPrice={Number(errorData.orderErrorInfo.shipping_cost)}
        />
        <SupportContact />
      </div>
    </div>
  );
};

const fetchOrderErrorData = async (orderErrorId: string) => {
  try {
    const data = await fetchHelper<{
      orderErrorInfo?: { order_items: string; shipping_cost: string };
      error?: string;
    }>(`http://127.0.0.1:4242/get-order-error?order-error-id=${orderErrorId}`);
    return { errorData: data };
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      console.log(error.data);
      return {
        fetchErrorDataError: error.data.error || "Order error data not found.",
      };
    } else {
      return { fetchErrorDataError: "An unexpected error occurred." };
    }
  }
};

const ErrorInfo = ({ orderErrorId }: { orderErrorId: string }) => (
  <div>
    <div className="flex flex-col justify-center items-center gap-3 h-full font-semibold text-center mb-7">
      <div className="w-1/4 mb-8 min-w-[400px] aspect-square relative">
        <Image
          src="/images/Transaction-Error.png"
          fill
          alt="transaction error"
          sizes="(min-width: 1024px) 25vw, 400px"
        />
      </div>
      <p className="text-4xl font-bold">Oops!</p>
      <p className="font-semibold">Something went wrong with your order.</p>
      <p className="text-slate-600 font-semibold">
        Don't worry, your payment has been received and your order has already
        been logged in our database. Our team is looking into the issue and will
        email you promptly once the issue is resolved.
      </p>
      <div className="bg-slate-400 w-full h-lineBreakHeight my-4" />
      <div className="ml-3">
        <p className="text-slate-600 font-semibold mb-3">Error Info</p>
        <div className="flex flex-col gap-2 px-6">
          <p className="text-black font-semibold">
            Order Error Id:{" "}
            <span className="font-semibold text-slate-700 block sm:inline-block">
              {orderErrorId}
            </span>
          </p>
          <p className="text-black font-semibold">
            Estimated resolution time:{" "}
            <span className="font-semibold text-slate-700 block sm:inline-block">
              24-48 hours
            </span>
          </p>
        </div>
      </div>
      <div className="bg-slate-400 w-full h-lineBreakHeight mt-4 mb-7" />
    </div>
  </div>
);

const SupportContact = () => (
  <div>
    <p className="font-semibold text-sm text-center">
      If you have any questions, please contact our support team at
      <a href="mailto:support@example.com"> support@example.com</a> or call us
      at +123-456-7890.
    </p>
  </div>
);

export default TransactionFailedError;
