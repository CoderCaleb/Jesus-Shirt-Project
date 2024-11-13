import React from "react";
import { fetchHelper } from "@/helpers/fetchHelper";
import { ProductData } from "@/types/product";
import ProductCard from "../ProductCard";

export default async function ProductGrid() {
  try {
    const shopData = await fetchHelper<ProductData[]>(
      "http://127.0.0.1:4242/get_store_products",
      { customConfig: { cache: "force-cache" } }
    );
    console.log("SHOP DATA", shopData);

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-auto md:w-full gap-3 md:gap-3 justify-center">
        {shopData && Array.isArray(shopData) && shopData.length > 0 ? (
          shopData.map((product, index) => (
            <div className="w-full" key={product.id || index}>
              <ProductCard productData={product} />
            </div>
          ))
        ) : (
          <div className="text-center col-span-full py-5">
            <p className="text-gray-500">
              No products available at the moment.
            </p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <h2 className="text-2xl font-bold text-red-600">
          Error Loading Products
        </h2>
        <p className="text-gray-600">
          We encountered an issue while fetching the products. Please try again
          later.
        </p>
      </div>
    );
  }
}
