"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartContext } from "@/context/CartContextProvider";
import { calculatePrices } from "@/helpers/generalHelpers";
import { CartData, Prices } from "@/types/product";
import CartBox from "@/components/features/cart/CartBox";
import Image from "next/image";
import RemoveItemModal from "@/components/ui/RemoveItemModal/RemoveItemModal";

const Cart: React.FC = () => {
  const router = useRouter();
  const { cartItems, isRemoveItemModalOpen } = useCartContext();
  const [prices, setPrices] = useState<Prices>({
    productPrice: 0,
    totalPrice: 0,
    shippingPrice: 0,
  });

  useEffect(() => {
    setPrices(calculatePrices(cartItems, 2));
    localStorage.setItem("cartItems",JSON.stringify(cartItems))
  }, [cartItems, calculatePrices]);

  const CartSummary = ({
    prices,
    cartItems,
  }: {
    prices: Prices;
    cartItems: CartData[];
  }) => (
    <div className=" w-4/12 h-min py-6 border-2 border-gray-200 mt-5 rounded-xl hidden lg:block">
      <p className="text-lg font-semibold px-5">Cart Summary</p>
      <div className=" bg-slate-400 w-full h-lineBreakHeight my-4" />
      <div className="flex justify-between px-5">
        <p className="text-sm text-slate-600 mb-3">Product's price</p>
        <p className="text-sm font-semibold">{`$${prices.productPrice} SGD`}</p>
      </div>
      <div className="flex justify-between px-5">
        <p className="text-sm text-slate-600">Shipping</p>
        <p className="text-sm font-semibold">{`$${prices.shippingPrice} SGD`}</p>
      </div>
      <div className=" bg-slate-400 w-full h-lineBreakHeight my-3" />
      <div className="flex justify-between px-5 py-3">
        <p className="text-sm font-semibold">Total</p>
        <p className="text-sm font-semibold">{`$${prices.totalPrice} SGD`}</p>
      </div>
      <div className="pt-5 px-5">
        <button
          className="border-2 w-full h-12 font-semibold rounded-3xl border-black bg-black text-white hover:bg-white hover:text-black"
          onClick={() => {
            localStorage.setItem(
              "checkoutItems",
              JSON.stringify({ checkoutItems: cartItems, fromCart: true })
            );
            router.push("/checkout");
          }}
        >
          Checkout
        </button>
      </div>
    </div>
  );

  const MobileCartSummary = ({
    prices,
    cartItems,
  }: {
    prices: Prices;
    cartItems: CartData[];
  }) => (
    <div className="w-full py-5 bg-white shadow-sm shadow-slate-900 rounded-tl-2xl rounded-tr-2xl">
      <div className="px-5 flex justify-between mb-3">
        <p className="text-sm text-slate-600 mb-3">Product's price</p>
        <p className="text-sm font-semibold">{`$${prices.productPrice} SGD`}</p>
      </div>
      <div className="px-5 flex justify-between">
        <p className="text-sm text-slate-600 mb-3">Shipping</p>
        <p className="text-sm font-semibold">{`$${prices.shippingPrice} SGD`}</p>
      </div>
      <div className=" bg-slate-400 w-full h-lineBreakHeight my-3" />
      <div className="px-5 flex justify-between mb-3">
        <p className="text-sm font-semibold">Total</p>
        <p className="text-sm font-semibold">{`$${prices.totalPrice} SGD`}</p>
      </div>
      <div className="px-5">
        <button
          className="border-2 w-full h-12 font-semibold rounded-3xl border-black bg-black text-white hover:bg-white hover:text-black"
          onClick={() => {
            localStorage.setItem(
              "checkoutItems",
              JSON.stringify({ checkoutItems: cartItems, fromCart: true })
            );
            router.push("/checkout");
          }}
        >
          Checkout
        </button>
      </div>
    </div>
  );

  const EmptyCartMessage = () => (
    <div className="flex w-full h-full justify-center items-center flex-col gap-5">
      <div className="relative aspect-square w-4/12 max-w-emptyCartImg">
        <Image
          src="/images/empty-cart-img.png"
          alt="empty cart img"
          fill
          sizes="(max-width: 768px) 80vw, (max-width: 1024px) 33.33vw, 33.33vw"
        />
      </div>
      <p className="text-lg font-semibold">You have no items in your cart</p>
    </div>
  );

  return (
    <div className="w-full h-full relative">
      <RemoveItemModal productData={isRemoveItemModalOpen.productData}/>
      <div className="w-full h-full px-10 pt-5 overflow-x-hidden overflow-y-scroll">
        {cartItems.length !== 0 ? (
          <div className="flex w-full">
            <div className="flex gap-3 flex-col w-full lg:w-8/12">
              {cartItems.map((value, index) => (
                <CartBox productData={value} key={index} />
              ))}
            </div>
            <CartSummary prices={prices} cartItems={cartItems} />
          </div>
        ) : (
          <EmptyCartMessage />
        )}
      </div>
      {cartItems.length !== 0 && (
        <div className="lg:hidden absolute bottom-0 w-full left-0">
          <MobileCartSummary prices={prices} cartItems={cartItems} />
        </div>
      )}
    </div>
  );
};

export default Cart;
