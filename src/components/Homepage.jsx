import React from "react";
import bestSellingData from "../bestSellingData";
import ProductCard from "./ProductCard";
export default function Homepage() {
  return (
    <div className="flex flex-1 flex-col items-center h-full overflow-y-scroll">
      <div className="px-6 mt-5 flex justify-between items-center w-full">
        <div>
          <img
            src={require("../images/jesus-cross-logo.png")}
            alt="logo"
            className="w-16 h-16"
          />
        </div>
        <div className="flex gap-5 items-center">
          <a className="text-sm" href="/">
            Home
          </a>
          <a className="text-sm mr-2" href="/shop">
            Shop
          </a>
          <button className="border-2 px-3 h-10 font-semibold rounded-xl border-black bg-black text-white hover:bg-white hover:text-black">
            Shop Now
          </button>
        </div>
      </div>
      <div className="flex items-center justify-center md:w-3/5 w-4/5 text-center flex-col gap-10 py-28">
        <p className="md:text-7xl text-6xl font-bold">Embrace your <span className="bg-gradient-to-r from-[#03bfcd] to-[#7731e7] text-transparent bg-clip-text">brave</span> side</p>
        <p className="md:w-11/12 w-full text-lg">
          The one stop shop for all ur clothing needs. Our clothing is nice and
          comfortable and feels nice and comfortable
        </p>
        <button className="border-2 px-7 h-12 font-semibold rounded-xl border-black bg-black text-white hover:bg-white hover:text-black">
          Shop Now
        </button>
      </div>
      <div className="flex m-auto items-center justify-center w-full text-center flex-col gap-10 py-28 bg-white">
        <p className="text-7xl font-bold">Best Sellers</p>
        <div className="flex overflow-x-scroll w-11/12 m-auto gap-3 justify-center">
          {bestSellingData.map((value, index) => {
            return <ProductCard productData={value} index={index} />;
          })}
        </div>
      </div>
      <div className="flex items-center justify-around lg:w-4/5 w-11/12 lg:gap-24 flex-col md:flex-row gap-10 md:gap-14 py-28">
        <div className="flex-1 w-full">
          <img
            src={require("../images/cool-jesus.jpeg")}
            alt="cool-jesus"
            className="w-full rounded-lg"
          />
        </div>
        <div className="flex-1 flex flex-col gap-6">
          <p className="md:text-7xl text-4xl font-bold">Spreading the gospel</p>
          <p className="text-lg">
            This clothes make it very easy to spread the gospel as it is very
            good. The shirts also have very nice designs and you can proudly
            wear it outside
          </p>
          <button className="border-2 w-fit px-12 h-12 font-semibold rounded-xl border-black bg-black text-white hover:bg-white hover:text-black">
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
}
