import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import ProductCard from "./ProductCard";

export default function Shop() {
  const [shopData, setShopData] = useState([]);
  function getShopProducts() {
    fetch("http://127.0.0.1:4242/get_store-products")
      .then((res) => res.json())
      .then((data) => setShopData(JSON.parse(data["result"])))
      .catch((err) => console.log(err));
  }
  useEffect(() => {
    if(shopData.length === 0){
      getShopProducts();
    }
  }, []);
  return (
    <div className="h-full overflow-y-scroll m-auto w-full pb-10 px-8">
      <div className="flex justify-center">
        <p className=" text-5xl font-semibold my-16">Shop 🛍️</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-auto md:w-full gap-3 md:gap-3 justify-center">
        {shopData.length !== 0 && Array.isArray(shopData) ? (
          shopData.map((product, index) => {
            return (
              <div className="w-full" key={index}>
                <ProductCard productData={product} index={index} />
              </div>
            );
          })
        ) : (
          <>
            <p className="text-center">Loading products...</p>
          </>
        )}
      </div>
    </div>
  );
}
