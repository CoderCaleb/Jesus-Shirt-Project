// File: SizePicker.jsx
import React, {useContext} from "react";
import { StateSharingContext } from "../contexts";
import DropdownChoice from "./DropdownChoice";

function SizePicker(props) {
  const { size, productData } = props;
  const { setCartItems } = useContext(StateSharingContext);
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
}

export default SizePicker;
