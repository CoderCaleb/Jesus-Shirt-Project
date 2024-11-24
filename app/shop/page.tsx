import React, { Suspense } from "react";
import ProductGrid from "@/components/features/shop/ProductGrid";
import SkeletonLoader from "@/components/features/shop/SkeletonLoader";
import ToastNotification from "@/components/features/shop/ToastContainer";

const Shop = () => {
  return (
      <div className="h-full overflow-y-scroll m-auto w-full pb-10 px-8">
        <div className="flex justify-center">
          <p className="text-5xl font-semibold my-16 text-black">Shop 🛍️</p>
        </div>
        <Suspense fallback={<SkeletonLoader />}>
          <ProductGrid />
        </Suspense>
        <ToastNotification/>
      </div>
  );
};
export default Shop;
