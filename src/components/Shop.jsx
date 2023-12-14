import React from "react";
import shirtData from "../shirtData";
import { useNavigate } from "react-router";
export default function Shop() {
  return (
    <div className="h-full overflow-y-scroll m-auto w-full pb-10 px-5">
      <div className="flex justify-center">
        <p className=" text-5xl font-semibold my-16">Shop 🛍️</p>
      </div>
      <div className="flex w-full flex-wrap gap-3 justify-center">
        {shirtData.map((value, index) => {
          return <ProductCard productData={value} index={index} key={index} />;
        })}
      </div>
    </div>
  );
}

function ProductCard(props) {
  const { productData, index } = props;
  const { id, name, price, image } = productData;
  const navigate = useNavigate();
  const colorArray = [
    "bg-orange-100",
    "bg-green-100",
    "bg-yellow-100",
    "bg-red-100",
  ];

  function getColorFromIndex(index) {
    return colorArray[index % colorArray.length];
  }
  return (
    <div className="md:basis-[calc(25%-15px)] basis-[calc(50%-15px)] grow-0 shrink-0 w-0">
      <div
        className={`rounded-lg flex flex-col gap-2 items-center md:px-5 md:py-3 justify-center cursor-pointer hover:scale-110 transition-all duration-150 bg-cardColorOne`}
        onClick={() => {
          navigate(`/shop/${id}`);
        }}
      >
        <img
          src={require(`../images/${image}`)}
          alt="shirt img"
          className=" w-full"
        />
      </div>
      <div className="my-3">
        <p className=" font-semibold inline-block">{name}</p>
        <p className="text-sm">{price}</p>
      </div>
    </div>
  );
}
