"use client";
import dynamic from "next/dynamic";

export default function page() {
  const ClientCartComponent = dynamic(
    () => import("../../components/features/cart/Cart"),
    { ssr: false },
  );
  const CartProvider = dynamic(
    () => import("../../context/CartContextProvider"),
    { ssr: false },
  );
  return (
    <CartProvider>
      <ClientCartComponent />
    </CartProvider>
  );
}
