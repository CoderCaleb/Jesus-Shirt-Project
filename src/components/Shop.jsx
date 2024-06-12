import React, {useEffect} from "react";
import useFetch from "../hooks/useFetch";
import ProductCard from "./ProductCard";

const Shop = () => {
  const { data: shopData, loading, error } = useFetch("http://127.0.0.1:4242/get_store-products");
  useEffect(()=>{
    console.log("shopData: ",shopData)
  },[shopData])
  return (
    <div className="h-full overflow-y-scroll m-auto w-full pb-10 px-8">
      <div className="flex justify-center">
        <p className="text-5xl font-semibold my-16">Shop 🛍️</p>
      </div>
      {loading ? (
        <p className="text-center">Loading products...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-auto md:w-full gap-3 md:gap-3 justify-center">
          {shopData && Array.isArray(shopData) && shopData.map((product, index) => (
            <div className="w-full" key={index}>
              <ProductCard productData={product} index={index} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
