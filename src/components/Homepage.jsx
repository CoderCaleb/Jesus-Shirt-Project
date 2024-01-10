import React from "react";
import bestSellingData from "../bestSellingData";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";
import { useTrail, animated } from "@react-spring/web";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Homepage() {
  const children = [
    <p className="md:text-8xl text-6xl">✝️</p>,
    <p className="md:text-7xl text-6xl font-bold lg:max-w-[850px]">
      Embrace your <span className=" text-red-500">brave</span> side
    </p>,
    <p className="w-full md:w-11/12 font-semibold text-slate-700 m-auto lg:max-w-[550px]">
      The one stop shop for all ur clothing needs. Our clothing is nice and
      comfortable and feels nice and comfortable
    </p>,
    <Link to="/shop">
      <button className="border-2 px-7 h-12 font-semibold rounded-xl border-black bg-black text-white hover:bg-white hover:text-black">
        Shop Now
      </button>
    </Link>,
  ];
  const [trails, api] = useTrail(
    children.length,
    () => ({
      from: { opacity: 0 },
      to: { opacity: 1 },
    }),
    []
  );
  return (
    <div className="flex flex-1 flex-col items-center h-full overflow-y-scroll">
      <div className="relative w-full">
        <div class="absolute -top-[150px] z-[1] left-1/2 h-[672px] w-full max-w-[1126px] -translate-x-1/2 rounded-full blur-[250px] opacity-40 [background:linear-gradient(180deg,rgba(0,102,255,0.30)_0%,rgba(143,0,255,0.30)_50%,rgba(255,0,184,0.30)_100%)]"></div>
        <div className="flex text-center w-full justify-center px-12 gap-10 items-center">
          <div className="flex flex-col items-center gap-7 py-36 sm:w-4/5 w-full z-10">
            {trails.map((styles, index) => {
              return (
                <animated.div style={styles}>{children[index]}</animated.div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex m-auto items-center justify-center w-full text-center flex-col gap-16 pb-20">
        <p className="text-5xl mx-3 font-bold">Best Sellers 🔥</p>
        <div className="flex lg:w-11/12 w-full gap-7 justify-center flex-wrap">
          {bestSellingData.map((value, index) => {
            return <ProductCard productData={value} index={index} />;
          })}
        </div>
      </div>
      <div className="bg-white w-full">
        <div className="flex items-center m-auto justify-around lg:w-4/5 w-11/12 lg:gap-16 flex-col md:flex-row gap-10 md:gap-14 py-20 ">
          <div className="flex-1 w-full">
            <img
              src={
                "https://static.canva.com/anon_home/benefits/benefits-together-en-1288x952.jpg"
              }
              alt="cool-jesus"
              className="w-full rounded-lg"
            />
          </div>
          <div className="flex-1 flex flex-col gap-6">
            <p className="md:text-5xl text-4xl font-semibold">
              Spreading the gospel
            </p>
            <p className="font-semibold text-slate-700">
              This clothes make it very easy to spread the gospel as it is very
              good. The shirts also have very nice designs and you can proudly
              wear it outside
            </p>
            <Link to="/shop">
              <button className="border-2 w-fit px-12 h-12 font-semibold rounded-xl border-black bg-black text-white hover:bg-white hover:text-black">
                Shop Now
              </button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
