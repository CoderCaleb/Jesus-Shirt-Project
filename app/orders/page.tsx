// app/orders/page.tsx
import React, { Suspense } from 'react';
import Loader from '@/components/ui/Loader';
import OrdersContent from '@/components/features/order';

export default function Orders() {
  return (
    <div className="w-full h-full px-7 py-7 overflow-y-scroll">
      <p className="font-semibold text-2xl mb-8">Your Orders</p>
      <Suspense fallback={<Loader/>}>
        <OrdersContent />
      </Suspense>
    </div>
  );
}
