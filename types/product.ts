export type ProductData = {
  id: string;
  name: string;
  price: string;
  thumbnail: string;
  product_images: string[];
};

export type CartData = ProductData & {
  size: SizeChoice;
  quantity: number;
};

export type Prices = {
  productPrice: number | string;
  totalPrice: number | string;
  shippingPrice: number | string;
};

export type SizeChoice = "XS" | "S" | "M" | "L" | "XL" | "2XL";
