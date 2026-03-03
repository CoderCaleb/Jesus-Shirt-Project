// components/orders/OrdersContent.server.tsx
import OrdersTable from "./OrdersTable";
import { getOrdersWithSession } from "./OrderHelpers";
import { TryRefreshComponent } from "@/components/utility/tryRefreshClientComponent";
import OrdersAccordian from "./OrdersAccordian";

type OrdersContentProps = {
    mode: "table" | "accordian"
}
export default async function OrdersContent({mode}:OrdersContentProps) {
  try {
    const ordersResponse = await getOrdersWithSession();
    return mode==='table'?<OrdersTable orders={ordersResponse.orders} />:<OrdersAccordian initialOrders={ordersResponse.orders}/>
  } catch (e: any) {
    if (e.message === "Token refresh required") {
      return <TryRefreshComponent key={Date.now()} />;
    }
    console.error(e);
    return <p>Something went wrong while fetching orders.</p>;
  }
}