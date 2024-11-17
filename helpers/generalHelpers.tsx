import { CartData } from "@/types/product";

export const calculatePrices = (products:CartData[], shippingPrice:number) => {
    const productPrice = products
      .reduce((total, item) => total + Number(item.price) * Number(item.quantity), 0)
      .toFixed(2);
    const totalPrice = (
      parseFloat(productPrice) + shippingPrice
    ).toFixed(2);
    return {
      productPrice: Number(productPrice),
      totalPrice: Number(totalPrice),
      shippingPrice: Number(shippingPrice),
    };
  };

  export const validateEmail = (email:string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  export const formatCurrency = (amount:number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };
  
export const checkCheckoutComplete = (number:number, checkoutProgress:number) =>
checkoutProgress >= number;