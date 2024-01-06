import React from "react";
import shirtData from "../shirtData";
import { useNavigate } from "react-router";
import ProductCard from "./ProductCard";

export default function Shop() {
  return (
    <div className="h-full overflow-y-scroll m-auto w-full pb-10 px-5">
      <div className="flex justify-center">
        <p className=" text-5xl font-semibold my-16">Shop 🛍️</p>
      </div>
      <div className="flex w-full flex-wrap gap-7 justify-center">
        {shirtData.map((value, index) => {
          return <ProductCard productData={value} index={index}/>;
        })}
      </div>
    </div>
  );
}


