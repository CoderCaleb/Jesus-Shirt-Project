"use client"

import React from "react";
import ProductCardUI from "./ProductCardUI";
import { ProductData } from "@/types/product";

export default function ProductCard({
  productData,
}: {
  productData: ProductData;
}) {
  const { id, name, product_images, price, thumbnail } = productData;
  return (
    <ProductCardUI
      id={id}
      name={name}
      thumbnailUrl={product_images ? product_images[0] : thumbnail}
      price={price}
    />
  );
}
