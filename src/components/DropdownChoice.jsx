// File: DropdownChoice.jsx
import React from "react";
import { toast } from "react-toastify";

function DropdownChoice(props) {
  const { size, setCartItems, productData } = props;

  const handleSizeChange = () => {
    setCartItems((prev) => {
      const cartData = [...prev];
      const itemInCartIndex = cartData.findIndex((item) => item === productData);
      if (!cartData.find((item) => productData.id === item.id && item.size === size)) {
        cartData[itemInCartIndex] = {
          ...cartData[itemInCartIndex],
          size: size,
        };
        return cartData;
      } else {
        toast("The size for that shirt is already in cart", { type: "error" });
        return prev;
      }
    });
  };

  return (
    <div
      className="flex items-center justify-center w-full h-10 hover:bg-slate-200"
      onClick={handleSizeChange}
    >
      <p className="text-sm">{size}</p>
    </div>
  );
}

export default DropdownChoice;
