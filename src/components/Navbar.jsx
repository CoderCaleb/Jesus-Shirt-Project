import React, {useContext} from "react";
import { useLocation } from "react-router-dom";
import useSidebarStatus from "../hooks/useSidebarStatus";
import { CheckoutContext } from "../App";
import { Link } from "react-router-dom";

export default function Navbar({from}) {
    const location = useLocation();
    let savedPageStatus = location.pathname.split("/")[1];
    const [pageStatus, setPageStatus] = useSidebarStatus(savedPageStatus)
    const {
      setCheckoutProgress
    } = useContext(CheckoutContext);

    const onShopIconClicked = (navigateTo) => {
      navigateTo("/shop");
      setPageStatus("shop")
      savedPageStatus = "shop"
      setCheckoutProgress(1)
    };
    
    const onCartIconClicked = (navigateTo) => {
      navigateTo("/cart");
      setPageStatus("cart")
      savedPageStatus = "cart"
      setCheckoutProgress(1)
    };

    const onHomeIconClicked = (navigateTo) => {
      navigateTo("/");
      setPageStatus("home")
      savedPageStatus = "home"
      setCheckoutProgress(1)
    };

    const checkIconActive = (iconPage) => {
      if(iconPage === pageStatus){
        return true
      }
      return false
    }
  return (
    <div className="relative px-6 flex justify-between items-center w-full bg-background shadow-md z-40">
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
        <a className="text-sm mr-2" href="/cart">
          Cart
        </a>
        <a className="text-sm mr-2" href="/shop">
          Shop
        </a>
        {from==="/"?<Link to="/shop">
          <button className="border-2 px-3 h-10 font-semibold rounded-xl border-black bg-black text-white hover:bg-white hover:text-black">
            Shop Now
          </button>
        </Link>:<></>}
      </div>
    </div>
  );
}
