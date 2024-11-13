import { Dispatch, SetStateAction } from "react";
import SizeChoiceBox from "./SizeChoiceBox";
import { SizeChoice } from "@/types/product";

const SizeSelector = ({ sizeChoice, setSizeChoice }:{sizeChoice:SizeChoice, setSizeChoice:Dispatch<SetStateAction<SizeChoice>>}) => {
    const sizes : SizeChoice[] = ["XS", "S", "M", "L", "XL", "2XL"];
    return (
      <div className="gap-3 flex items-center flex-col md:flex-row">
        <p className="text-sm font-semibold mr-2 whitespace-nowrap">
          Select Size
        </p>
        <div className="flex gap-3">
          {sizes.map((size) => (
            <SizeChoiceBox
              key={size}
              size={size}
              handleSelect={() => setSizeChoice(size)}
              sizeChoice={sizeChoice}
            />
          ))}
        </div>
      </div>
    );
  };
export default SizeSelector  