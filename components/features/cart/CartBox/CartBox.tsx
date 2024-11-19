// File: CartBox.tsx
import React, { useContext } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import SizePicker from "./SizePicker";
import { CartData } from "@/types/product";
import { useCartContext } from "@/context/CartContextProvider";
import Image from "next/image";
interface CartBoxProps {
  productData: CartData;
}

const CartBox: React.FC<CartBoxProps> = ({ productData }) => {
  const { setCartItems } = useCartContext();
  const { name, price, product_images, size, quantity } = productData;
  const { setIsRemoveItemModalOpen } = useCartContext();

  const handleIncreaseQuantity = () => {
    setCartItems((prev) => {
      const cartData = [...prev];
      const itemInCartIndex = cartData.findIndex(
        (item) => item.id === productData.id && item.size === productData.size
      );
      cartData[itemInCartIndex] = {
        ...cartData[itemInCartIndex],
        quantity: cartData[itemInCartIndex].quantity + 1,
      };
      return cartData;
    });
  };

  const handleDecreaseQuantity = () => {
    setCartItems((prev) => {
      const cartData = [...prev];
      const itemInCartIndex = cartData.findIndex(
        (item) => item.id === productData.id && item.size === productData.size
      );
      if (cartData[itemInCartIndex].quantity > 1) {
        cartData[itemInCartIndex] = {
          ...cartData[itemInCartIndex],
          quantity: cartData[itemInCartIndex].quantity - 1,
        };
        return cartData;
      } else {
        setIsRemoveItemModalOpen({ state: true, productData: productData });
        return prev;
      }
    });
  };

  return (
    <div className="w-full flex py-5 md:p-5 items-center justify-center px-2">
      <div className="flex md:gap-5 items-center basis-[66.6%] md:basis-auto justify-between">
        <div className="relative aspect-square">
          <Image
            src={product_images[0]}
            className="rounded-md"
            alt="product"
            width={96}
            height={96}
          />
        </div>
        <div className="flex flex-col gap-2 text-center md:basis-auto basis-[50%] md:text-left text-sm sm:text-base">
          <p className="font-semibold">{name}</p>
          <div className="flex gap-3 sm:gap-1 items-center md:justify-start justify-center">
            <p className="text-slate-400">Size:</p>
            <p className="hidden sm:block">{size}</p>
            <div className="block sm:hidden">
              <SizePicker size={size} productData={productData} />
            </div>
          </div>
          <div className="flex-1 block md:hidden">
            <p className="font-semibold">{`$${price} SGD`}</p>
          </div>
        </div>
      </div>
      <div className="flex-1 hidden md:block">
        <p className="font-semibold text-center">{`$${price} SGD`}</p>
      </div>
      <div className="flex max-w gap-3 items-center flex-1 justify-end">
        <p className="text-slate-400 hidden md:block">Quantity:</p>
        <div className="px-2 py-1 rounded-lg w-20 flex justify-between items-center border-slate-300 border-2">
          <p>{quantity}</p>
          <div className="flex flex-col justify-between">
            <IoIosArrowUp
              size={10}
              className="cursor-pointer"
              onClick={handleIncreaseQuantity}
            />
            <IoIosArrowDown
              size={10}
              className="cursor-pointer"
              onClick={handleDecreaseQuantity}
            />
          </div>
        </div>
        <div className="hidden sm:block">
          <SizePicker size={size} productData={productData} />
        </div>
      </div>
    </div>
  );
};

export default CartBox;
