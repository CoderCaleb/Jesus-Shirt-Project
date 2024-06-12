import React, { useContext } from "react";
import { MdDeleteForever } from "react-icons/md";
import { StateSharingContext } from "../contexts";
export default function RemoveItemModal(props) {
  const { productData } = props;
  const { name } = productData;
  const { setShowRemoveItem, setCartItems } = useContext(StateSharingContext);

  return (
    <>
    <div className=" absolute w-screen h-screen justify-center items-center flex bg-darkenBg z-50">
      <div className="flex flex-col gap-3 items-center justify-center p-4 bg-background rounded-md shadow-md shadow-slate-600 ">
        <MdDeleteForever size={50} className="text-red-500" />
        <p className="text-lg font-semibold">Remove Item</p>
        <p className="font-light text-sm text-slate-700 text-center">
          Do you want to remove <span className="font-semibold">{name}</span>{" "}
          from cart?
        </p>
        <div className="flex gap-3">
          <button
            className="border-2 border-none text-white bg-red-600 w-24 h-10 font-semibold rounded-md hover:shadow-xl shadow-slate-800"
            onClick={() => {
              setCartItems((prev) => {
                const cartData = [...prev];
                const itemInCartIndex = cartData.findIndex((item) => {
                  return item === productData;
                });
                cartData.splice(itemInCartIndex, 1);
                setShowRemoveItem({
                  state:false,
                  productData:""
                })
                return cartData;
              });
            }}
          >
            Remove
          </button>
          <button
            className="border-2 border-black w-24 h-10 font-semibold rounded-md"
            onClick={() => {
              setShowRemoveItem({
                state: false,
                productData: "",
              });
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    </>
  );
}
