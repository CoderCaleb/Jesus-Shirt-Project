import React, { useState, useEffect } from "react";
import { FaShop } from "react-icons/fa6";
import { RiShoppingCartFill } from "react-icons/ri";
import { FaCross } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router";
import useSidebarStatus from "../hooks/useSidebarStatus";
let savedPageStatus = ""
export default function SideBar() {
    const location = useLocation();
    let savedPageStatus = location.pathname.split("/")[1];
    const [pageStatus, setPageStatus] = useSidebarStatus(savedPageStatus)

    const onShopIconClicked = (navigateTo) => {
      navigateTo("/shop");
      setPageStatus("shop")
      savedPageStatus = "shop"
    };
    
    const onCartIconClicked = (navigateTo) => {
      navigateTo("/cart");
      setPageStatus("cart")
      savedPageStatus = "cart"
    };

    const checkIconActive = (iconPage) => {
      if(iconPage === pageStatus){
        return true
      }
      return false
    }
    useEffect(()=>{
        console.log(pageStatus)
    },[pageStatus])
  return (
    <div className="flex flex-col w-16 h-full bg-black items-center gap-3 pt-3 shadow-md shadow-black">
      <SideBarIcon IconElement={<FaCross color="white" size={20}/>} onClickFunction={onShopIconClicked}/>
      <div className=" bg-slate-600 w-4/5 h-lineBreakHeight"/>
      <SideBarIcon IconElement={<FaShop className={`${checkIconActive("shop")?"text-white":"text-slate-400"}`}/> } onClickFunction={onShopIconClicked}/>
      <SideBarIcon IconElement={<RiShoppingCartFill className={`${checkIconActive("cart")?"text-white":"text-slate-400"}`} />} onClickFunction={onCartIconClicked}/>
    </div>
  );
}

function SideBarIcon(props) {
  const {IconElement, onClickFunction} = props
  const navigate = useNavigate()

  return (
    <div className=" w-12 h-12 flex items-center justify-center cursor-pointer" onClick={()=>{
        onClickFunction(navigate)
    }}>
      {IconElement}
    </div>
  );
}
