import React from "react";
import bestSellingData from "../bestSellingData";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";
import { useTrail, animated } from "@react-spring/web";

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
        <div className="px-6 mt-5 flex justify-between items-center w-full z-10">
          <div>
            <img
              src={require("../images/jesus-cross-logo.png")}
              alt="logo"
              className="w-16 h-16 cursor-pointer"
            />
          </div>
          <div className="flex gap-5 items-center font-semibold z-10">
            <a className="text-sm" href="/">
              Home
            </a>
            <a className="text-sm mr-2" href="/shop">
              Shop
            </a>
            <Link to="/shop">
              <button className="border-2 px-3 h-10 font-semibold rounded-xl border-black bg-black text-white hover:bg-white hover:text-black">
                Shop Now
              </button>
            </Link>
          </div>
        </div>
        <div className="flex text-center w-full justify-center px-12 gap-10 items-center">
          <div className="flex flex-col items-center gap-7 py-20 sm:w-4/5 w-full z-10">
            {trails.map((styles, index) => {
              return (
                <animated.div style={styles}>{children[index]}</animated.div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex m-auto items-center justify-center w-full text-center flex-col gap-16 py-20">
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
              src={"https://static.canva.com/anon_home/benefits/benefits-together-en-1288x952.jpg"}
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


      <footer class="bg-black text-white w-full">
    <div class="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div class="md:flex md:justify-between">
            <div class="mb-6 md:mb-0">
                <a href="/" class="flex items-center">
                    <span class="self-center text-2xl font-semibold whitespace-nowrap">Jesus Shirts</span>
                </a>
            </div>
            <div class="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
                  <h2 class="mb-6 text-sm font-semibold text-white uppercase dark:text-white">Resources</h2>
                  <ul class="text-gray-400 dark:text-gray-400 font-medium">
                      <li class="mb-4">
                          <a href="/" class="hover:underline">Flowbite</a>
                      </li>
                      <li>
                          <a href="https://tailwindcss.com/" class="hover:underline">Tailwind CSS</a>
                      </li>
                  </ul>
              </div>
              <div>
                  <h2 class="mb-6 text-sm font-semibold text-white uppercase dark:text-white">Follow us</h2>
                  <ul class="text-gray-400 dark:text-gray-400 font-medium">
                      <li class="mb-4">
                          <a href="/" class="hover:underline ">Github</a>
                      </li>
                      <li>
                          <a href="/" class="hover:underline">Discord</a>
                      </li>
                  </ul>
              </div>
              <div>
                  <h2 class="mb-6 text-sm font-semibold text-white uppercase dark:text-white">Legal</h2>
                  <ul class="text-gray-400 dark:text-gray-400 font-medium">
                      <li class="mb-4">
                          <a href="#" class="hover:underline">Privacy Policy</a>
                      </li>
                      <li>
                          <a href="#" class="hover:underline">Terms &amp; Conditions</a>
                      </li>
                  </ul>
              </div>
            </div>
        </div>
        <hr class="my-6 border-gray-200 sm:mx-auto" />
        <div class="sm:flex sm:items-center sm:justify-between">
            <span class="text-sm">© 2023 <a href="/" class="hover:underline">Jesus-Shirts™</a>. All Rights Reserved.</span>
            <div class="flex mt-4 sm:justify-center sm:mt-0">
                <a href="#" class="text-white hover:text-gray-900">
                <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 8 19">
                        <path fill-rule="evenodd" d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z" clip-rule="evenodd"/>
                    </svg>
                  <span class="sr-only">Facebook page</span>
                    <span class="sr-only">Facebook page</span>
                </a>
            </div>
        </div>
    </div>
</footer>

    </div>
  );
}
