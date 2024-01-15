import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useSidebarStatus from "../hooks/useSidebarStatus";
import { CheckoutContext } from "../App";
import { Link } from "react-router-dom";

export default function Navbar({ from }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  let savedPageStatus = location.pathname.split("/")[1];
  const [pageStatus, setPageStatus] = useSidebarStatus(savedPageStatus);
  console.log(pageStatus);
  const { setCheckoutProgress } = useContext(CheckoutContext);
  const navigate = useNavigate();

  const onShopIconClicked = (navigateTo) => {
    navigateTo("/shop");
    setPageStatus("shop");
    savedPageStatus = "shop";
    setCheckoutProgress(1);
    setIsOpen(false)
  };

  const onCartIconClicked = (navigateTo) => {
    navigateTo("/cart");
    setPageStatus("cart");
    savedPageStatus = "cart";
    setCheckoutProgress(1);
    setIsOpen(false)
  };

  const onHomeIconClicked = (navigateTo) => {
    navigateTo("/");
    setPageStatus("");
    savedPageStatus = "";
    setCheckoutProgress(1);
    setIsOpen(false)
  };

  const checkIconActive = (iconPage) => {
    if (iconPage === pageStatus) {
      return true;
    }
    return false;
  };
  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="relative px-6 flex justify-between items-center w-full bg-background shadow-md z-40">
      {isOpen?<div className="w-full flex gap-7 flex-col bg-white py-5 absolute left-0 top-[64px] cursor-pointer">
        <div className="px-7">
          <div
            className={`text-lg font-bold inline-block ${
              checkIconActive("") ? " border-b-2 border-black " : ""
            }`}
            onClick={() => onHomeIconClicked(navigate)}
          >
            Home
          </div>{" "}
        </div>
        <div className="px-7">
          <div
            className={`text-lg font-bold inline-block ${
              checkIconActive("cart") ? " border-b-2 border-black " : ""
            }`}
            onClick={() => onCartIconClicked(navigate)}
          >
            Cart
          </div>{" "}
        </div>
        <div className="px-7">
          <div
            className={`text-lg font-bold inline-block ${
              checkIconActive("shop") ? " border-b-2 border-black " : ""
            }`}
            onClick={() => onShopIconClicked(navigate)}
          >
            Shop
          </div>{" "}
        </div>
      </div>:<></>}
      <div>
        <img
          src={require("../images/jesus-cross-logo.png")}
          alt="logo"
          className="w-16 h-16 cursor-pointer"
        />
      </div>
      <div className="flex gap-5 items-center font-semibold z-10 cursor-pointer">
        <div className="md:flex hidden gap-5">
          <div
            className={`text-sm ${
              checkIconActive("") ? " border-b-2 border-black " : ""
            }`}
            onClick={() => onHomeIconClicked(navigate)}
          >
            Home
          </div>
          <div
            className={`text-sm mr-2 ${
              checkIconActive("cart") ? " border-b-2 border-black" : ""
            }`}
            onClick={() => onCartIconClicked(navigate)}
          >
            Cart
          </div>
          <div
            className={`text-sm mr-2 ${
              checkIconActive("shop") ? " border-b-2 border-black " : ""
            }`}
            onClick={() => onShopIconClicked(navigate)}
          >
            Shop
          </div>
        </div>
        {from === "/" ? (
          <Link to="/shop">
            <button className="border-2 px-3 h-10 font-semibold rounded-xl border-black bg-black text-white hover:bg-white hover:text-black">
              Shop Now
            </button>
          </Link>
        ) : (
          <></>
        )}
        <div
          onClick={handleClick}
          className="flex flex-col justify-center items-center w-5 md:hidden"
        >
          <span
            className={`bg-slate-600 block transition-all duration-300 ease-out 
                    h-1 w-full rounded-sm ${
                      isOpen ? "rotate-45 translate-y-2" : "-translate-y-0.5"
                    }`}
          ></span>
          <span
            className={`bg-slate-600 block transition-all duration-300 ease-out 
                    h-1 w-full rounded-sm my-0.5 ${
                      isOpen ? "opacity-0" : "opacity-100"
                    }`}
          ></span>
          <span
            className={`bg-slate-600 block transition-all duration-300 ease-out 
                    h-1 w-full rounded-sm ${
                      isOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"
                    }`}
          ></span>
        </div>
      </div>
    </div>
  );
}
