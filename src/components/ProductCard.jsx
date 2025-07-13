import React from "react";
import { useNavigate } from "react-router";

export default function ProductCard({ productData, index, fromPage }) {
  const { id, name, product_images, price, thumbnail } = productData;

  console.log(fromPage);
  console.log(`productData ${index}: ${JSON.stringify(productData)}`);

  return (
    <ProductCardUI
      id={id}
      name={name}
      thumbnailUrl={product_images ? product_images[0] : thumbnail}
      price={price}
    />
  );
}

function ProductCardUI({ thumbnailUrl, name, price, id }) {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(`/shop/${id}`);
  };

  return (
    <div className="w-full h-full" key={id}>
      <div
        className="rounded-md overflow-hidden flex flex-col gap-2 items-center justify-center cursor-pointer transition-all duration-150 bg-cardColorOne shadow-lg hover:shadow-slate-300"
        onClick={handleNavigation}
      >
        <img src={thumbnailUrl} alt={`${name} thumbnail`} className="w-full" />
      </div>
      <div className="my-3 font-semibold text-lg">
        <p className="inline-block">{name}</p>
        <p className="text-base">{`$${price}`}</p>
      </div>
    </div>
  );
}
