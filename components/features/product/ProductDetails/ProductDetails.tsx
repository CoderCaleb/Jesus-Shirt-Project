"use client";
import { handleAddToCart, handleBuyNow } from "@/helpers/ProductHelpers";
import { ProductData, SizeChoice } from "@/types/product";
import { useState } from "react";
import SizeSelector from "./SizeSelector";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

const ProductDetails = ({ product }: { product: ProductData }) => {
  const router = useRouter();
  const [sizeChoice, setSizeChoice] = useState<SizeChoice>("S");

  return (
    <div className="flex min-w flex-col md:w-auto w-full gap-6 text-center md:text-left">
      <p className="font-bold text-4xl">{product.name}</p>
      <p className="text-lg font-semibold">{`$${product.price} SGD`}</p>
      <SizeSelector sizeChoice={sizeChoice} setSizeChoice={setSizeChoice} />
      <div className=" bg-slate-400 w-full h-[1px]" />
      <div className="flex md:flex-row flex-col gap-5 max-w-lg w-full m-auto">
        <Button
          buttonText="Add to Cart"
          onClick={() => handleAddToCart(product, sizeChoice)}
          buttonType="transparent"
        />

        <Button
          buttonText="Buy Now"
          onClick={() => handleBuyNow(product, sizeChoice, router)}
          buttonType="black"
          additionalStyles="md:mb-0 mb-10"
        />
      </div>
    </div>
  );
};

export default ProductDetails;
