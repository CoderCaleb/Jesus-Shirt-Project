import React from "react";
const { useNavigate } = require("react-router");

export default function ProductCard(props) {
    const { productData, index } = props;
    const { id, name, price, image } = productData;
    const navigate = useNavigate();

    return (
      <div className="md:basis-[calc(25%-15px)] basis-[calc(50%-15px)] grow-0 shrink-0 w-0" key={index}>
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