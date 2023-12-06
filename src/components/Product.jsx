import React, { useState, useContext } from "react";
import { useParams } from "react-router";
import { faker } from "@faker-js/faker";
import shirtData from "../shirtData";
import { StateSharingContext } from "../App.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setItem } from "localforage";

export default function Product() {
  const { productId } = useParams();
  const product = shirtData.find((shirt) => shirt.id === Number(productId));
  const [sizeChoice, setSizeChoice] = useState("S");
  const { setCartItems } = useContext(StateSharingContext);

  function handleAddToCart(productInfo) {
    productInfo = { ...productInfo, size: sizeChoice, quantity: 1 };
    setCartItems((prev) => {
      const productInCartIndex = prev.findIndex(item=>item && (item.id === product.id&&item.size === productInfo.size))
      const productData = [...prev]
      toast("Item successfully added in your cart 🛒",{
        type:"success",
      })
      if(productInCartIndex !== -1){
        console.log("Item in cart already")
        
        productData[productInCartIndex] = {
            ...productData[productInCartIndex],
            quantity: productData[productInCartIndex].quantity + 1,
          }
        console.log(productData)
        return productData
      }
      else{
        console.log("Item not in cart yet")
        return [...prev, productInfo];
      }
    });
  }

  return (
    <div className="flex flex-col md:flex-row p-10 md:justify-center gap-10 items-center w-full overflow-y-scroll">
      <div className=" grid-cols-2 gap-4 w-6/12 max-w-maxImageGridWidth h-min hidden min-w-minPictureGrid md:grid">
        <ProductImage image={product.image4} />
        <ProductImage image={product.image2} />
        <ProductImage image={product.image3} />
        <ProductImage image={product.image4} />
      </div>
      <div className="block w-full md:hidden max-w-[500px] my-10">
        <ProductImage image={product.image4}/>
      </div>
      <div className="flex min-w flex-col gap-8 text-center md:text-left">
        <p className="font-semibold text-5xl">{product.name}</p>
        <p className="text-xl font-semibold">{`$${product.price} SGD`}</p>
        <div className="gap-3 flex items-center flex-col md:flex-row">
          <p className="text-sm font-semibold mr-2">Select Size</p>
          <div className="flex gap-3">
          <SizeChoiceBox
            size="S"
            handleSelect={() => {
              setSizeChoice("S");
            }}
            sizeChoice={sizeChoice}
          />
          <SizeChoiceBox
            size="M"
            handleSelect={() => {
              setSizeChoice("M");
            }}
            sizeChoice={sizeChoice}
          />
          <SizeChoiceBox
            size="L"
            handleSelect={() => {
              setSizeChoice("L");
            }}
            sizeChoice={sizeChoice}
          />
          <SizeChoiceBox
            size="XL"
            handleSelect={() => {
              setSizeChoice("XL");
            }}
            sizeChoice={sizeChoice}
          />
          <SizeChoiceBox
            size="XXL"
            handleSelect={() => {
              setSizeChoice("XXL");
            }}
            sizeChoice={sizeChoice}
          />
          </div>
        </div>
        <div>
          <div className=" bg-slate-500 w-full h-lineBreakHeight max-w-lg" />

          <div className="flex md:flex-row flex-col gap-5 mt-8 max-w-lg">
            <button
              className="border-2 border-black w-full h-12 font-semibold rounded-md hover:bg-black hover:text-white"
              onClick={() => handleAddToCart(product)}
            >
              Add to Cart
            </button>
            <button className="border-2 border-none text-white bg-indigo-700 w-full h-12 font-semibold rounded-md hover:shadow-xl shadow-indigo-800">
              Buy Now
            </button>
          </div>
        </div>
      </div>
      <ToastContainer 
        position="top-center"
        theme="light"
      />
    </div>
  );
}

function ProductImage(props) {
  const { image } = props;
  return (
    <img
      src={image}
      alt="product img"
      className=" w-full object-fill rounded-md h-auto"
    />
  );
}

function SizeChoiceBox(props) {
  const { size, handleSelect, sizeChoice } = props;
  return (
    <button
      className={`p-1 cursor-pointer rounded-lg border-2 ${
        sizeChoice === size ? " bg-lime-300 border-indigo-700" : "border-black"
      }`}
      onClick={handleSelect}
    >
      <p className={` text-xs ${sizeChoice === size ? " font-semibold" : ""}`}>
        {size}
      </p>
    </button>
  );
}
