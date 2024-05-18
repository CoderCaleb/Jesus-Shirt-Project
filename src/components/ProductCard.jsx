import React from "react";
import shirtData from "../shirtData";
const { useNavigate } = require("react-router");

export default function ProductCard(props) {
  const { productData, index, fromPage } = props;
  const { id, name, product_images, price } = productData;
  console.log(fromPage)

  return (
    <ProductCardUI id={id} name={name} thumbnail_url={product_images[0]} price={price}/>
  );
}

function ProductCardUI({ thumbnail_url, name, price, id }) {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full" key={id}>
      <div
        className={`rounded-md overflow-hidden flex flex-col gap-2 items-center justify-center cursor-pointer transition-all duration-150 bg-cardColorOne shadow-lg hover:shadow-slate-300`}
        onClick={() => {
          navigate(`/shop/${id}`);
        }}
      >
        <img src={thumbnail_url} alt="shirt img" className=" w-full" />
      </div>
      <div className="my-3 font-semibold text-lg">
        <p className="inline-block">{name}</p>
        <p className="text-base">{price}</p>
      </div>
    </div>
  );
}
