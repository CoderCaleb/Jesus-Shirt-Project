import { SizeChoice } from "@/types/product";

const SizeChoiceBox = ({ size, handleSelect, sizeChoice }: {size:SizeChoice, handleSelect:()=>void, sizeChoice:SizeChoice}) => {
    return (
      <button
        className={`${
          sizeChoice === size ? "bg-secondary2 border-none" : ""
        } w-10 h-10 cursor-pointer rounded-lg border-2 border-slate-300 `}
        onClick={handleSelect}
      >
        <p
          className={`text-xs text-black ${
            sizeChoice === size ? "font-semibold text-white" : ""
          }`}
        >
          {size}
        </p>
      </button>
    );
  };

export default SizeChoiceBox