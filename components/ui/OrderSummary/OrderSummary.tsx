import { calculatePrices, formatCurrency } from "@/helpers/generalHelpers";
import { CartData } from "@/types/product";
import ItemCard from "../ItemCard";

interface OrderSummaryProps {
  orderItems: CartData[];
  shippingPrice: number;
}

export default function OrderSummary({ orderItems, shippingPrice }: OrderSummaryProps) {
  const prices = calculatePrices(orderItems, shippingPrice)

  return (
    <div>
      <div className="flex flex-col pl-3 pt-3">
        <p className="text-slate-600 font-semibold">Items</p>
        <div className="w-full overflow-y-scroll h-60 mt-3">
          {orderItems.map((product, index) => {
            return <ItemCard productInfo={product} index={index} key={index} />;
          })}
        </div>
        <div className=" bg-slate-400 w-full h-lineBreakHeight my-4" />
      </div>
      <div>
        <div className="flex justify-between px-5">
          <p className="text-sm text-slate-700 mb-3">Product's price</p>
          <p className="text-sm font-semibold">{`${formatCurrency(prices.productPrice)} SGD`}</p>
        </div>
        <div className="flex justify-between px-5">
          <p className="text-sm text-slate-700">Shipping</p>
          <p className="text-sm font-semibold">{`${formatCurrency(prices.shippingPrice)} SGD`}</p>
        </div>
        <div className="flex justify-between px-5 py-3">
          <p className="text-sm font-semibold">Total</p>
          <p className="text-sm font-semibold">{`${formatCurrency(prices.totalPrice)} SGD`}</p>
        </div>
      </div>
    </div>
  );
}
