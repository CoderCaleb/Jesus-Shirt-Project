// File: SizePicker.tsx
import React, { useContext } from "react";
import DropdownChoice from "./DropdownChoice";
import { CartData } from "@/types/product";
import { useCartContext } from "@/context/CartContextProvider";

interface SizePickerProps {
  size: string;
  productData: CartData
}

const SizePicker: React.FC<SizePickerProps> = ({ size, productData }) => {
  const { setCartItems } = useCartContext()
  const elementSize = 10;
  const sizeStyle = `w-${elementSize} h-${elementSize}`;

  return (
    <div
      className={`${sizeStyle} rounded-3xl flex justify-center items-center shadow-md shadow-slate-400 cursor-pointer relative group`}
    >
      <p className="text-sm font-semibold">{size}</p>
      <div
        className={`hidden flex-col absolute w-10 rounded-md shadow-md shadow-slate-400 top-10 group-hover:flex z-10 bg-background`}
      >
        {["S", "M", "L", "XL", "XXL"].map((sizeOption) => (
          <DropdownChoice
            key={sizeOption}
            size={sizeOption}
            setCartItems={setCartItems}
            productData={productData}
          />
        ))}
      </div>
    </div>
  );
};

export default SizePicker;
