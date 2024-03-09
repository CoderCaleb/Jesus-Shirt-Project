import React from "react";
import shirtData from "../shirtData";
import ProductCard from "./ProductCard";

export default function Shop() {
  return (
    <div className="h-full overflow-y-scroll m-auto w-full pb-10 md:px-5 px-0">
      <div className="flex justify-center">
        <p className=" text-5xl font-semibold my-16">Shop 🛍️</p>
      </div>
      <div className="flex w-full flex-wrap sm:gap-7 gap-3 justify-center">
        {shirtData.map((value, index) => {
          return (
            <div className="lg:basis-[calc(25%-35px)] md:basis-[calc(50%-35px)] basis-[calc(50%-15px)]" key={index}>
              <ProductCard productData={value} index={index} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
