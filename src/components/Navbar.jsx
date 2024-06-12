import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { FiShoppingCart, FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";
import useSidebarStatus from "../hooks/useSidebarStatus";
import { CheckoutContext, StateSharingContext } from "../contexts";

const Navbar = ({ from }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const savedPageStatus = location.pathname.split("/")[1];
  const [pageStatus, setPageStatus] = useSidebarStatus(savedPageStatus);
  const { setCheckoutProgress } = useContext(CheckoutContext);
  const { user } = useContext(StateSharingContext);

  const handleNavigation = (page) => {
    navigate(`/${page}`);
    setCheckoutProgress(1);
    setIsOpen(false);
  };

  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        toast("You have successfully logged out", { type: "success" });
      })
      .catch(() => {
        toast("Log out unsuccessful. Please try again", { type: "error" });
      });
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const checkIconActive = (iconPage) => iconPage === pageStatus;

  return (
    <div className="relative px-6 flex justify-between items-center w-full bg-background shadow-md z-40">
      {isOpen && (
        <div className="w-full flex gap-7 flex-col bg-white py-5 absolute left-0 top-[64px] cursor-pointer">
          <NavbarLink text="Home" isActive={checkIconActive("")} onClick={() => handleNavigation("")} />
          <NavbarLink text="Cart" isActive={checkIconActive("cart")} onClick={() => handleNavigation("cart")} />
          <NavbarLink text="Shop" isActive={checkIconActive("shop")} onClick={() => handleNavigation("shop")} />
        </div>
      )}
      <Link to="/">
        <img src={require("../images/jesus-cross-logo.png")} alt="logo" className="w-16 h-16 cursor-pointer" />
      </Link>
      <div className="flex gap-5 items-center font-semibold z-10 cursor-pointer justify-center">
        <Navlink content={<FiShoppingCart size={22} />} clickedFunc={() => handleNavigation("cart")} />
        {user && (
          <UserDropdown user={user} handleSignOut={handleSignOut} />
        )}
        {!user && (
          <>
            <Navlink content="Login" clickedFunc={() => handleNavigation("login")} dontHide />
            <Navlink content="Sign up" clickedFunc={() => handleNavigation("signup")} dontHide />
          </>
        )}
        {from === "/" ? (
          <Link to="/shop">
            <button className="border-2 px-3 h-10 font-semibold rounded-xl border-black bg-black text-white hover:bg-white hover:text-black">
              Shop Now
            </button>
          </Link>
        ) : (
          <Navlink content="Shop" clickedFunc={() => handleNavigation("shop")} />
        )}
        <HamburgerMenu isOpen={isOpen} toggleSidebar={toggleSidebar} />
      </div>
    </div>
  );
};

const NavbarLink = ({ text, isActive, onClick }) => (
  <div className="px-7">
    <div className={`text-lg font-bold inline-block ${isActive ? "border-b-2 border-black" : ""}`} onClick={onClick}>
      {text}
    </div>
  </div>
);

const Navlink = ({ content, clickedFunc, dontHide }) => (
  <div className={`md:flex gap-5 ${dontHide ? "flex" : "hidden"}`}>
    <div className="text-sm mr-2" onClick={clickedFunc}>
      {content}
    </div>
  </div>
);

const DropdownChoice = ({ link, clickedFunc }) => (
  <div className="flex items-center justify-center w-full h-10 px-3 hover:bg-slate-200" onClick={clickedFunc}>
    <p className="text-sm">{link}</p>
  </div>
);

const UserDropdown = ({ user, handleSignOut }) => {
  const navigate = useNavigate()
  return(
  <div className="group flex justify-center">
    <FiUser size={22} />
    <div className="hidden flex-col absolute rounded-md shadow-md shadow-slate-400 top-10 group-hover:flex z-10 bg-background">
      <DropdownChoice link="Profile" clickedFunc={() => navigate("/profile")} />
      <DropdownChoice link="Orders" clickedFunc={() => navigate("/orders")} />
      <DropdownChoice link="Logout" clickedFunc={handleSignOut} />
    </div>
  </div>)
};

const HamburgerMenu = ({ isOpen, toggleSidebar }) => (
  <div className="md:hidden flex gap-3">
    <div onClick={toggleSidebar} className="flex flex-col justify-center items-center w-5">
      <span className={`bg-slate-600 block transition-all duration-300 ease-out h-1 w-full rounded-sm ${isOpen ? "rotate-45 translate-y-2" : "-translate-y-0.5"}`}></span>
      <span className={`bg-slate-600 block transition-all duration-300 ease-out h-1 w-full rounded-sm my-0.5 ${isOpen ? "opacity-0" : "opacity-100"}`}></span>
      <span className={`bg-slate-600 block transition-all duration-300 ease-out h-1 w-full rounded-sm ${isOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"}`}></span>
    </div>
  </div>
);

export default Navbar;
