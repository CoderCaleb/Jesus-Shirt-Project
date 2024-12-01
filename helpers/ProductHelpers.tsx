import { CartData, ProductData, SizeChoice } from "@/types/product";
import { toast } from "react-toastify";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const handleAddToCart = (
  productInfo: ProductData,
  sizeChoice: SizeChoice,
) => {
  const updatedProductInfo = { ...productInfo, size: sizeChoice, quantity: 1 };
  const cartItems: CartData[] =
    JSON.parse(localStorage.getItem("cartItems") || "[]") || [];
  const productInCartIndex = cartItems.findIndex(
    (item) =>
      item &&
      item.id === productInfo.id &&
      item.size === updatedProductInfo.size,
  );

  if (productInCartIndex !== -1) {
    cartItems[productInCartIndex].quantity += 1;
  } else {
    cartItems.push(updatedProductInfo);
  }

  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  toast("Item successfully added in your cart 🛒", { type: "success" });
};

export const handleBuyNow = (
  productInfo: ProductData,
  sizeChoice: string,
  router: AppRouterInstance,
) => {
  const productArr = [{ ...productInfo, size: sizeChoice, quantity: 1 }];
  localStorage.setItem(
    "checkoutItems",
    JSON.stringify({ checkoutItems: productArr, fromCart: false }),
  );
  router.push("/checkout");
};
