import React from "react";

type OrderDetailsProps = {
  formattedOrderDate: string;
  estimatedDelivery: string;
};

const OrderDetails: React.FC<OrderDetailsProps> = ({
  formattedOrderDate,
  estimatedDelivery,
}) => (
  <div className="flex gap-3 h-5">
    <p className="text-sm text-slate-600">
      Order date:{" "}
      <span className="font-semibold block sm:inline-block">
        {formattedOrderDate}
      </span>
    </p>
    <div className="bg-slate-300 h-full w-[2px]" />
    <p className="text-sm text-successGreen font-semibold">
      Estimated delivery:{" "}
      <span className="block sm:inline-block">{estimatedDelivery}</span>
    </p>
  </div>
);

export default OrderDetails;
