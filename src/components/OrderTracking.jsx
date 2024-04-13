import React, { useState } from "react";
import { useParams } from "react-router";

export default function OrderTracking() {
  const { orderId } = useParams();
  const [orderInfo, setOrderInfo] = useState({
    
  })
  return(
    <div className="w-full h-full">
        <div className="flex">
            <p className="text-2xl font-semibold">{`Order ID: ${orderId}`}</p>
        </div>
        <div className="flex gap-3">
            <p className="text-sm text-slate-600">Order date: <span className="font-semibold">{orderInfo.orderDate}</span></p>
            <div className=" bg-slate-400 h-full w-2" />
        </div>
    </div>
  )
}
