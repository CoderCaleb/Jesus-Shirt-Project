import React, { useState, useEffect } from "react";
import ItemCard from "@/components/ui/ItemCard";
import { calculatePrices, formatCurrency } from "@/helpers/generalHelpers";
import { CartData, Prices } from "@/types/product";

interface OrderSummaryPanelProps {
  checkoutItems: CartData[];
  shippingPrice: number;
}

const OrderSummaryPanel: React.FC<OrderSummaryPanelProps> = ({
  checkoutItems,
  shippingPrice,
}) => {
  const [prices, setPrices] = useState<Prices>({
    productPrice: "0",
    totalPrice: "0",
    shippingPrice: "0",
  });
  useEffect(() => {
    setPrices(calculatePrices(checkoutItems, shippingPrice));
  }, [checkoutItems, calculatePrices]);
  return (
    <div className="w-1/2 h-full px-5 py-5 bg-slate-100 flex-col justify-center hidden md:flex">
      <div className="overflow-y-scroll">
        {checkoutItems.map((product, index) => (
          <ItemCard productInfo={product} key={index} index={index} />
        ))}
      </div>
      <div className="bg-slate-400 w-full h-lineBreakHeight my-3" />
      <div>
        <PriceDetail label="Product's price" amount={prices.productPrice} />
        <PriceDetail label="Shipping" amount={prices.shippingPrice} />
        <TotalPrice amount={prices.totalPrice} />
      </div>
    </div>
  );
};
interface PriceDetailProps {
  label: string;
  amount: number | string;
}

const PriceDetail: React.FC<PriceDetailProps> = ({ label, amount }) => (
  <div className="flex justify-between px-5">
    <p className="text-sm text-slate-600 mb-3">{label}</p>
    <p className="text-sm font-semibold">{`$${amount} SGD`}</p>
  </div>
);

interface TotalPriceProps {
  amount: number | string;
}

const TotalPrice: React.FC<TotalPriceProps> = ({ amount }) => (
  <div className="flex justify-between px-5 py-3">
    <p className="text-sm font-semibold">Total</p>
    <p className="text-sm font-semibold">{`$${amount} SGD`}</p>
  </div>
);

export default OrderSummaryPanel;
