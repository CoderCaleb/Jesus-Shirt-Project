import { CartData } from "@/types/product";
import React from "react";
import Image from "next/image";

type ItemCardProps = {
  productInfo: CartData;
  index: number;
};

const ItemCard: React.FC<ItemCardProps> = ({ productInfo, index }) => {
  const {
    product_images: productImages,
    thumbnail,
    quantity,
    name,
    price,
    size,
  } = productInfo;

  const productImageSrc = productImages ? productImages[0] : thumbnail;

  return (
    <div
      className="flex w-full justify-between p-6 gap-3 items-center"
      key={index}
    >
      <div className="flex gap-3 items-center">
        <div className="w-16 h-16 min-w-[4rem] min-h-[4rem] relative border-1 rounded-lg flex items-center justify-center">
          <div className="overflow-hidden rounded-lg relative aspect-square">
            <Image
              src={productImageSrc}
              alt={`product image ${index}`}
              width={64}
              height={64}
              className="border-none"
            />{" "}
          </div>
          <div className="absolute bg-black rounded-3xl w-5 h-5 flex items-center justify-center text-white font-semibold z-30 text-sm -top-1 -left-1">
            <p>{quantity}</p>
          </div>
        </div>
        <div className="text-sm font-semibold">
          <p>{name}</p>
          <p className="text-slate-500">
            <span className="sm:hidden">{`$${price} / `}</span>
            {size}
          </p>
        </div>
      </div>
      <div className="font-semibold hidden sm:block">
        <p>{`$${price}`}</p>
      </div>
    </div>
  );
};

export default ItemCard;
