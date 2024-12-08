import OrderDetails from "@/components/features/order/OrderDetails/OrderDetails";
import OrderTimeline from "@/components/features/order/OrderTimeline/OrderTimeline";
import PaymentAndDeliveryDetails from "@/components/features/order/PaymentAndDeliveryDetails/PaymentAndDeliveryDetails";
import OrderSummary from "@/components/ui/OrderSummary/OrderSummary";
import { TryRefreshComponent } from "@/components/utility/tryRefreshClientComponent";
import { fetchOrderData } from "@/helpers/dataFetchHelpers";
import { getSSRSessionHelper } from "@/helpers/serverAuthHelpers";
import { CartData } from "@/types/product";
import { redirect } from "next/navigation";

interface OrderTrackingPageProps {
  params: Promise<{ order_id: string }>;
  searchParams: Promise<{ order_token?: string }>;
}

export default async function OrderTrackingPage({
  params,
  searchParams,
}: OrderTrackingPageProps) {
  const { order_id } = await params;
  const { order_token } = await searchParams;
  const { accessTokenPayload, hasToken, error } = await getSSRSessionHelper();

  if (error) {
    return (
      <div>
        Something went wrong while trying to get the session. Error -{" "}
        {error.message}
      </div>
    );
  }

  if (accessTokenPayload === undefined) {
    if (!hasToken) {
      console.log("No access token");
    } else {
      return <TryRefreshComponent key={Date.now()} />;
    }
  }

  const orderResponse = await fetchOrderData(order_id, order_token);

  // Handle different response scenarios
  if (orderResponse.status === "error") {
    if (orderResponse.redirect) {
      const redirectParams = new URLSearchParams({
        from: "order-tracking",
        state: orderResponse.state || "",
        orderId: order_id,
      });

      if (orderResponse.linkedUserEmail) {
        redirectParams.set("linkedUserEmail", orderResponse.linkedUserEmail);
      }

      if (order_token) {
        redirectParams.set("orderToken", order_token);
      }

      return redirect(`${orderResponse.redirect}?${redirectParams.toString()}`);
    }

    return (
      <div className="error-container">
        <p>{orderResponse.error || "An unexpected error occurred"}</p>
      </div>
    );
  }

  // Successful order fetch
  const { orderData, paymentData } = orderResponse.orderData!;

  const timelineStatus = [
    "Order Confirmed",
    "Printing",
    "Out for Delivery",
    "Delivered",
  ];

  const index = timelineStatus.findIndex(
    (value) => value.toLowerCase() === orderData.status,
  );
  const orderDate = new Date(orderData.order_date * 1000); //convert to milliseconds
  const formattedOrderDate = orderDate.toLocaleDateString("en-US");

  return (
    <div className="w-full h-full px-7 py-7 overflow-y-scroll">
      <div className="flex mb-5">
        <p className="text-2xl font-semibold">{`Order ID: ${order_id}`}</p>
      </div>
      <div className="flex flex-col gap-4">
        <OrderDetails
          formattedOrderDate={formattedOrderDate}
          estimatedDelivery={"May 16 2022"}
        />
        <OrderTimeline
          timelineStatus={timelineStatus}
          orderDate={orderDate}
          index={index}
        />
      </div>
      <OrderSummary
        orderItems={orderData.full_order_items as CartData[]}
        shippingPrice={orderData.shipping_cost as number}
      />
      <div className=" bg-slate-400 w-full h-lineBreakHeight mb-4" />
      <PaymentAndDeliveryDetails
        paymentData={paymentData}
        orderInfo={orderData}
      />
    </div>
  );
}
