import React from "react";
const { useNavigate } = require("react-router");

export default function ProductCard(props) {
    const { productData, index } = props;
    const { id, name, price, image } = productData;
    const navigate = useNavigate();

    return (
      <div className="md:basis-[calc(25%-35px)] basis-[calc(50%-35px)] grow-0 shrink-0 w-0" key={index}>
        <div
          className={`rounded-lg flex flex-col gap-2 items-center md:px-5 md:py-3 justify-center cursor-pointer transition-all duration-150 bg-cardColorOne shadow-lg hover:shadow-slate-300`}
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
        <div className="my-3 font-semibold">
          <p className="inline-block">{name}</p>
          <p className="text-sm">{price}</p>
        </div>
      </div>
    );
  }