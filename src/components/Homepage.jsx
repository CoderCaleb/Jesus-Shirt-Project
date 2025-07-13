import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  useTrail,
  useTransition,
  useSpring,
  animated,
} from "@react-spring/web";
import bestSellingData from "../bestSellingData";
import ProductCard from "./ProductCard";
import Navbar from "./Navbar";
import Footer from "./Footer";
import InfiniteScroll from "./InfiniteScroll";

export default function Homepage() {
  // Refs for observing elements
  const firstElementRef = useRef(null);
  const secondElementRef = useRef(null);
  const thirdElementRef = useRef(null);

  // State for tracking intersection status
  const [firstElementIntersecting, setFirstElementIntersecting] =
    useState(false);
  const [secondElementIntersecting, setSecondElementIntersecting] =
    useState(false);
  const [thirdElementIntersecting, setThirdElementIntersecting] =
    useState(false);

  // State for animated children
  const [firstElementChildren, setFirstElementChildren] = useState(null);
  const [thirdElementChildren, setThirdElementChildren] = useState(null);

  // Intersection observer handler
  function handleIntersectionObserver(element, updateState) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        updateState(entry.isIntersecting);
      });
    });
    if (element) observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
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

  // Animated properties for first element
  const children = [
    <p className="md:text-8xl text-7xl font-bold lg:max-w-[850px] ">
      Spread{" "}
      <nobr>
        the <span className=" text-red-500">word</span>
      </nobr>
    </p>,
    <p className="w-full md:w-11/12 text-slate-600 font-semibold m-auto lg:max-w-[550px]">
      The one stop shop for all your clothing needs. Our clothing is nice and
      comfortable and feels nice and comfortable.
    </p>,
    <Link to="/shop">
      <button className="border-2 px-7 h-12 font-semibold rounded-xl border-black bg-black text-white hover:bg-white hover:text-black">
        Shop Now
      </button>
    </Link>,
  ];

  const firstElementProps = useTransition(children, {
    from: { opacity: 0, scale: 0.93 },
    enter: (msg, i) => ({ delay: i * 300, opacity: 1, scale: 1 }),
  });

  useEffect(() => {
    if (firstElementIntersecting) {
      setFirstElementChildren(
        firstElementProps((styles, element) => (
          <animated.div style={styles}>{element}</animated.div>
        ))
      );
    }
  }, [firstElementIntersecting]);

  // Animated properties for second element
  const secondElementProps = useSpring({
    opacity: secondElementIntersecting ? 1 : 0,
    x: secondElementIntersecting ? 0 : 20,
    from: { opacity: 0, x: 20 },
    config: { tension: 2000, friction: 200 },
  });

  // Animated properties for third element
  const bestSellingElement = bestSellingData.map((value, index) => (
    <ProductCard key={index} productData={value} fromPage="homepage" />
  ));

  const thirdElementProps = useTransition(bestSellingElement, {
    from: { opacity: 0, scale: 0.93 },
    enter: (msg, i) => ({ delay: i * 400, opacity: 1, scale: 1 }),
  });

  useEffect(() => {
    if (thirdElementIntersecting) {
      setThirdElementChildren(
        thirdElementProps((styles, element) => (
          <animated.div
            style={styles}
            className="md:basis-[calc(25%-35px)] basis-[calc(50%-35px)]"
          >
            {element}
          </animated.div>
        ))
      );
    }
  }, [thirdElementIntersecting]);

  return (
    <div className="flex flex-1 flex-col items-center h-full overflow-y-scroll">
      <div className="relative w-full">
        <div className="flex text-center w-full gap-8 items-center justify-center sm:pt-[120px] sm:pb-[125px] sm:px-[65px] py-20 px-6">
          <div
            className="flex flex-col items-center gap-7 h-vh z-10"
            ref={firstElementRef}
          >
            {firstElementChildren}
          </div>
        </div>
        <div className="mb-10">
          <InfiniteScroll />
        </div>
      </div>
      <div className="flex m-auto items-center justify-center w-full text-center flex-col gap-16 pb-20">
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
              src="https://static.canva.com/anon_home/benefits/benefits-together-en-1288x952.jpg"
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
              wear it outside.
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
