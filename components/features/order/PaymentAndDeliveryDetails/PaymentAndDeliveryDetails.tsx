import DisplayShippingAddress from "@/components/ui/DisplayShippingAddress";
import React from "react";
import { OrderData, PaymentMethodData } from "@/types/order";

type PaymentAndDeliveryDetailsProps = {
  paymentData: PaymentMethodData;
  orderInfo: OrderData;
};

const PaymentAndDeliveryDetails: React.FC<PaymentAndDeliveryDetailsProps> = ({
  paymentData,
  orderInfo,
}) => (
  <div className="flex justify-evenly items-center font-semibold">
    <div className="flex flex-col gap-2">
      <p className="text-lg">Payment</p>
      <div className="flex flex-col text-slate-600 text-sm">
        {paymentData.type === "card" ? (
          <div>
            <p>{paymentData.card?.brand}</p>
            <p>{"**** **** **** " + paymentData.card?.last4}</p>
            <p>
              {paymentData.card &&
                `${paymentData.card.exp_month}/${paymentData.card.exp_year}`}
            </p>
          </div>
        ) : (
          <div>
            <p>{"Payment by " + paymentData.type}</p>
          </div>
        )}
      </div>
    </div>
    <div className="flex flex-col gap-2">
      <p className="text-lg">Delivery</p>
      <p className="text-slate-600 text-xs">Address</p>
      <DisplayShippingAddress
        address={orderInfo.shipping_address ? orderInfo.shipping_address : {}}
        textStyle="text-slate-600"
      />
    </div>
  </div>
);

export default PaymentAndDeliveryDetails;
