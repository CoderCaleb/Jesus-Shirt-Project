import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useSidebarStatus from "../hooks/useSidebarStatus";
import { CheckoutContext, StateSharingContext } from "../App";
import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { FiUser } from "react-icons/fi";
import { getAuth, signOut } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";

export default function Navbar({ from }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  let savedPageStatus = location.pathname.split("/")[1];
  const [pageStatus, setPageStatus] = useSidebarStatus(savedPageStatus);
  const [userHovered, setUserHovered] = useState(false);
  console.log(pageStatus);
  const { setCheckoutProgress } = useContext(CheckoutContext);
  const { user } = useContext(StateSharingContext);
  const navigate = useNavigate();

  const onShopIconClicked = () => {
    iconClicked("shop");
  };

  const onCartIconClicked = () => {
    iconClicked("cart");
  };

  const onHomeIconClicked = () => {
    iconClicked("");
  };

  const onLoginIconClicked = () => {
    iconClicked("login");
  };
  const onSignUpIconClicked = () => {
    iconClicked("signup");
  };

  function handleSignOut() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        toast("You have successfully logged out", {
          type: "success",
        });
      })
      .catch((error) => {
        toast("Log out unsccessful. Please try again", { type: "error" });
      });
  }

  function iconClicked(page) {
    navigate(`/${page}`);
    savedPageStatus = page;
    setCheckoutProgress(1);
    setIsOpen(false);
  }

  const checkIconActive = (iconPage) => {
    if (iconPage === pageStatus) {
      return true;
    }
    return false;
  };
  const handleClick = () => {
    setIsOpen(!isOpen);
    console.log(user)
  };
  return (
    <div>
      <div className="relative px-6 flex justify-between items-center w-full bg-background shadow-md z-40">
        {isOpen ? (
          <div className="w-full flex gap-7 flex-col bg-white py-5 absolute left-0 top-[64px] cursor-pointer">
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
                Cart{" "}
              </div>{" "}
            </div>
            <div className="px-7">
              <div
                className={`text-lg font-bold inline-block ${
                  checkIconActive("shop") ? " border-b-2 border-black " : ""
                }`}
                onClick={() => onShopIconClicked(navigate)}
              >
                Shop{" "}
              </div>{" "}
            </div>
          </div>
        ) : (
          <></>
        )}
        <Link to="/">
          <div>
            <img
              src={require("../images/jesus-cross-logo.png")}
              alt="logo"
              className="w-16 h-16 cursor-pointer"
            />
          </div>
        </Link>
        <div className="flex gap-5 items-center font-semibold z-10 cursor-pointer justify-center">
          <Navlink
            content={<FiShoppingCart size={22} />}
            clickedFunc={onCartIconClicked}
          />
          {user ? (
            <div className="group flex justify-center">
              <FiUser className="" size={22} />
              <div className="hidden flex-col absolute rounded-md shadow-md shadow-slate-400 top-10 group-hover:flex z-10 bg-background">
                <DropdownChoice link={"Profile"} clickedFunc={()=>navigate("/profile")} />
                <DropdownChoice link={"Orders"} clickedFunc={()=>navigate("/orders")} />
                <DropdownChoice link={"Logout"} clickedFunc={handleSignOut} />
              </div>
            </div>
          ) : (
            <></>
          )}
          {!user?<Navlink content={"Login"} clickedFunc={onLoginIconClicked} dontHide/>:<></>}
          {!user?<Navlink content={"Sign up"} clickedFunc={onSignUpIconClicked} dontHide/>:<></>}
          {from === "/" ? (
            <Link to="/shop">
              <button className="border-2 px-3 h-10 font-semibold rounded-xl border-black bg-black text-white hover:bg-white hover:text-black">
                Shop Now
              </button>
            </Link>
          ) : (
            <>
              <Navlink content={"Shop"} clickedFunc={onShopIconClicked} />
            </>
          )}
          <div className="md:hidden flex gap-3">
            <div
              onClick={handleClick}
              className="flex flex-col justify-center items-center w-5"
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
      </div>
    </div>
  );

  function Navlink({ content, clickedFunc, dontHide }) {
    return (
      <div className={`md:flex gap-5 ${dontHide ? "flex" : "hidden"}`}>
        <div className={`text-sm mr-2`} onClick={() => clickedFunc(navigate)}>
          {content}
        </div>
      </div>
    );
  }
  function DropdownChoice(props) {
    const { link, clickedFunc } = props;
    return (
        <div
          className="flex items-center justify-center w-full h-10 px-3 hover:bg-slate-200"
          onClick={clickedFunc}
        >
          <p className="text-sm">{link}</p>
        </div>
    );
  }
}
