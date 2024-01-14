import React, { useRef, useEffect, useState } from "react";
import bestSellingData from "../bestSellingData";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";
import {
  useTrail,
  useTransition,
  useSpring,
  animated,
} from "@react-spring/web";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Homepage() {
  const firstElementRef = useRef(null);
  let [firstElementIntersecting, setFirstElementIntersecting] = useState(false);
  const [firstElementChildren, setFirstElementChildren] = useState(null);
  const secondElementRef = useRef(null);
  let [secondElementIntersecting, setSecondElementIntersecting] =
    useState(false);
  const thirdElementRef = useRef(null);
  let [thirdElementIntersecting, setThirdElementIntersecting] = useState(false);
  const [thirdElementChildren, setThirdElementChildren] = useState(null);
  function handleIntersectionObserver(element, updateState) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        updateState(entry.isIntersecting);
      });
    });
    console.log(element);
    if (firstElementRef) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }
  useEffect(() => {
    handleIntersectionObserver(
      firstElementRef.current,
      setFirstElementIntersecting
    );
    handleIntersectionObserver(
      secondElementRef.current,
      setSecondElementIntersecting
    );
    handleIntersectionObserver(
      thirdElementRef.current,
      setThirdElementIntersecting
    );
  }, []);
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
  const firstElementProps = useTransition(children, {
    from: {
      opacity: 0,
      scale: 0.93,
    },
    enter: (msg, i) => ({
      delay: () => {
        return i * 300;
      },
      opacity: 1,
      scale: 1,
    }),
  });

  useEffect(() => {
    setFirstElementChildren(
      firstElementProps((styles, element) => {
        return <animated.div style={styles}>{element}</animated.div>;
      })
    )
  }, [firstElementIntersecting]);

  const secondElementProps = useSpring({
    opacity: secondElementIntersecting ? 1 : 0,
    x: secondElementIntersecting ? 0 : 20,
    from: { opacity: 0, x: 20 },
    config: { tension: 2000, friction: 200 },
  });

  const bestSellingElement = bestSellingData.map((value,index)=>{
    return(
      <ProductCard productData={value} index={index} />
    )
  })
  const thirdElementProps = useTransition(
    bestSellingElement,
    {
      from: {
        opacity: 0,
        scale: 0.93,
      },
      enter: (msg, i) => ({
        delay: () => {
          return i * 400;
        },
        opacity: 1,
        scale: 1,
      }),
    }
  );

  useEffect(() => {
    setThirdElementChildren(thirdElementProps((styles, element) => {
      return (
        <animated.div
          style={styles}
          className="md:basis-[calc(25%-35px)] basis-[calc(50%-35px)]"
        >
          {element}
        </animated.div>
      );
    }));
  }, [thirdElementIntersecting]);
  useEffect(() => {
    console.log("Third element intersecting", thirdElementIntersecting);
  }, [thirdElementIntersecting]);
  return (
    <div className="flex flex-1 flex-col items-center h-full overflow-y-scroll">
      <div className="relative w-full">
        <div class="absolute -top-[150px] z-[1] left-1/2 h-[672px] w-full max-w-[1126px] -translate-x-1/2 rounded-full blur-[250px] opacity-40 [background:linear-gradient(180deg,rgba(0,102,255,0.30)_0%,rgba(143,0,255,0.30)_50%,rgba(255,0,184,0.30)_100%)]"></div>
        <div className="flex text-center w-full justify-center px-12 gap-10 items-center">
          <div
            className="flex flex-col items-center gap-7 py-28 sm:w-4/5 w-full z-10"
            ref={firstElementRef}
          >
            {firstElementChildren}
          </div>
        </div>
      </div>
      <div className="flex m-auto items-center justify-center w-full text-center flex-col gap-16 pb-20 pt-7">
        <animated.div style={secondElementProps}>
          <p className="text-5xl mx-3 font-bold" ref={secondElementRef}>
            Best Sellers 🔥
          </p>
        </animated.div>
        <div
          className="flex lg:w-11/12 w-full gap-7 justify-center flex-wrap"
          ref={thirdElementRef}
        >
          {thirdElementChildren}
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
