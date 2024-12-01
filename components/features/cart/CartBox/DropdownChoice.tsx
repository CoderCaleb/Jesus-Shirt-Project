// File: DropdownChoice.tsx
import React from "react";
import { toast } from "react-toastify";

interface DropdownChoiceProps {
  size: string;
  setCartItems: React.Dispatch<React.SetStateAction<any[]>>;
  productData: { id: string; size?: string };
}

const DropdownChoice: React.FC<DropdownChoiceProps> = ({
  size,
  setCartItems,
  productData,
}) => {
  const handleSizeChange = () => {
    setCartItems((prev) => {
      const cartData = [...prev];
      const itemInCartIndex = cartData.findIndex(
        (item) => item.id === productData.id,
      );

      if (
        !cartData.find(
          (item) => item.id === productData.id && item.size === size,
        )
      ) {
        if (itemInCartIndex !== -1) {
          cartData[itemInCartIndex] = {
            ...cartData[itemInCartIndex],
            size: size,
          };
        }
        return cartData;
      } else {
        toast("The size for that shirt is already in the cart", {
          type: "error",
        });
        return prev;
      }
    });
  };

  return (
    <div
      className="flex items-center justify-center w-full h-10 hover:bg-slate-200 cursor-pointer"
      onClick={handleSizeChange}
    >
      <p className="text-sm">{size}</p>
    </div>
  );
};

export default DropdownChoice;
