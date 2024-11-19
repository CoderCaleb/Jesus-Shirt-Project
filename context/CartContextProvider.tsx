"use client";
import { CartData } from "@/types/product";
import React, { createContext, useState, ReactNode, useContext } from "react";

export interface CartContextType {
  cartItems: CartData[];
  setCartItems: React.Dispatch<React.SetStateAction<CartData[]>>;
  isRemoveItemModalOpen: { state: boolean; productData?: CartData };
  setIsRemoveItemModalOpen: React.Dispatch<
    React.SetStateAction<{ state: boolean; productData?: CartData }>
  >;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

interface CartProviderProps {
  children: ReactNode;
}

const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartData[]>(
    JSON.parse(localStorage.getItem("cartItems") || "[]")
  );
  const [isRemoveItemModalOpen, setIsRemoveItemModalOpen] = useState<{
    state: boolean;
    productData?: CartData;
  }>({ state: false });

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        isRemoveItemModalOpen,
        setIsRemoveItemModalOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext: () => CartContextType = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("CartContext must be used within a CartProvider");
  }

  return context;
};

export default CartProvider;
