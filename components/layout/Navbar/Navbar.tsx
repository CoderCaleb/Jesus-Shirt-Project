"use client"
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiShoppingCart, FiUser } from "react-icons/fi";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

const user = null

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();
  const [pageStatus, setPageStatus] = useState<string>("");

  useEffect(() => {
    const savedPageStatus = pathname.split("/")[1];
    setPageStatus(savedPageStatus);
  }, [pathname]);

  const handleNavigation = (page: string) => {
    router.push(`/${page}`);
    setIsOpen(false);
    setPageStatus(page);
  };
/*
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        toast("You have successfully logged out", { type: "success" });
      })
      .catch(() => {
        toast("Log out unsuccessful. Please try again", { type: "error" });
      });
  };
  */

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const checkIconActive = (iconPage: string) => iconPage === pageStatus;

  return (
    <div className="relative px-6 flex justify-between items-center w-full bg-white shadow-md z-40 h-[64px]">
      {isOpen && (
        <div className="w-full flex gap-7 flex-col bg-white py-5 absolute left-0 top-[64px] cursor-pointer md:hidden">
          <NavbarLink text="Home" isActive={checkIconActive("")} onClick={() => handleNavigation("")} />
          <NavbarLink text="Cart" isActive={checkIconActive("cart")} onClick={() => handleNavigation("cart")} />
          <NavbarLink text="Shop" isActive={checkIconActive("shop")} onClick={() => handleNavigation("shop")} />
        </div>
      )}
      <Link href="/">
        <Image src={"/images/jesus-cross-logo.png"} alt="logo" width={64} height={64} className="cursor-pointer" />
      </Link>
      <div className="flex gap-5 items-center font-semibold z-10 cursor-pointer justify-center">
        <Navlink content={<FiShoppingCart size={22} />} clickedFunc={() => handleNavigation("cart")} />
        {user && (
          <UserDropdown /*handleSignOut={handleSignOut}*/ />
        )}
        {!user && (
          <>
            <Navlink content="Login" clickedFunc={() => handleNavigation("login")} dontHide />
            <Navlink content="Sign up" clickedFunc={() => handleNavigation("signup")} dontHide />
          </>
        )}
        {pathname === "/" ? (
          <Link href="/shop">
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

// Define type for NavbarLink component
interface NavbarLinkProps {
  text: string;
  isActive: boolean;
  onClick: () => void;
}

const NavbarLink: React.FC<NavbarLinkProps> = ({ text, isActive, onClick }) => (
  <div className="px-7">
    <div className={`text-lg font-bold inline-block ${isActive ? "border-b-2 border-black" : ""}`} onClick={onClick}>
      {text}
    </div>
  </div>
);

interface NavlinkProps {
  content: React.ReactNode;
  clickedFunc: () => void;
  dontHide?: boolean;
}

const Navlink: React.FC<NavlinkProps> = ({ content, clickedFunc, dontHide }) => (
  <div className={`md:flex gap-5 ${dontHide ? "flex" : "hidden"}`}>
    <div className="text-sm mr-2" onClick={clickedFunc}>
      {content}
    </div>
  </div>
);

interface DropdownChoiceProps {
  link: string;
  clickedFunc: () => void;
}

const DropdownChoice: React.FC<DropdownChoiceProps> = ({ link, clickedFunc }) => (
  <div className="flex items-center justify-center w-full h-10 px-3 hover:bg-slate-200" onClick={clickedFunc}>
    <p className="text-sm">{link}</p>
  </div>
);

interface UserDropdownProps {
  //handleSignOut: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ /*handleSignOut*/ }) => {
  const router = useRouter();
  return (
    <div className="group flex justify-center">
      <FiUser size={22} />
      <div className="hidden flex-col absolute rounded-md shadow-md shadow-slate-400 top-10 group-hover:flex z-10 bg-background">
        <DropdownChoice link="Profile" clickedFunc={() => router.push("/profile")} />
        <DropdownChoice link="Orders" clickedFunc={() => router.push("/orders")} />
        <DropdownChoice link="Logout" clickedFunc={()=>{}} />
      </div>
    </div>
  );
};

interface HamburgerMenuProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, toggleSidebar }) => (
  <div className="md:hidden flex gap-3">
    <div onClick={toggleSidebar} className="flex flex-col justify-center items-center w-5">
      <span className={`bg-slate-600 block transition-all duration-300 ease-out h-1 w-full rounded-sm ${isOpen ? "rotate-45 translate-y-2" : "-translate-y-0.5"}`}></span>
      <span className={`bg-slate-600 block transition-all duration-300 ease-out h-1 w-full rounded-sm my-0.5 ${isOpen ? "opacity-0" : "opacity-100"}`}></span>
      <span className={`bg-slate-600 block transition-all duration-300 ease-out h-1 w-full rounded-sm ${isOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"}`}></span>
    </div>
  </div>
);

export default Navbar;
