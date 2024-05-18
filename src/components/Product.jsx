import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import shirtData from "../shirtData";
import { StateSharingContext, CheckoutContext } from "../App.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setItem } from "localforage";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

export default function Product() {
  const { productId } = useParams();
  const [sizeChoice, setSizeChoice] = useState("S");
  const [variant, setVariant] = useState({});
  const [product, setProduct] = useState({});
  const { setCartItems } = useContext(StateSharingContext);

  const navigate = useNavigate();

  function handleAddToCart(productInfo) {
    productInfo = { ...productInfo, size: sizeChoice, quantity: 1 };
    setCartItems((prev) => {
      const productInCartIndex = prev.findIndex(
        (item) =>
          item && item.id === product.id && item.size === productInfo.size
      );
      const productData = [...prev];
      toast("Item successfully added in your cart 🛒", {
        type: "success",
      });
      if (productInCartIndex !== -1) {
        console.log("Item in cart already");

        productData[productInCartIndex] = {
          ...productData[productInCartIndex],
          quantity: productData[productInCartIndex].quantity + 1,
        };
        console.log(productData);
        return productData;
      } else {
        console.log("Item not in cart yet");
        return [...prev, productInfo];
      }
    });
  }

  function handleBuyNow(product) {
    const productArr = [{ ...product, size: sizeChoice, quantity: 1 }];
    navigate("/checkout", { state: { checkoutItems: productArr } });
  }
  function handleFetchProduct(id) {
    fetch(`http://127.0.0.1:4242/fetch_product`, {
      method: "POST",
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    handleFetchProduct(productId);
  }, []);
  useEffect(()=>{
    console.log(product)
  },[product])
  useEffect(() => {
    
  }, [sizeChoice, product]);
  return (
    <div className="w-full overflow-y-scroll">
      {Object.keys(product).length !== 0? (
        <div className="flex flex-col md:flex-row p-10 md:justify-center gap-10 lg:gap-16 items-center h-full w-full">
          <div className=" grid-cols-2 gap-4 w-6/12 max-w-maxImageGridWidth h-min hidden min-w-minPictureGrid lg:grid">
            {product["product_images"].map((image,index)=>{
              return <ProductImage image={image} index={index}/>
            })}
          </div>
          <div className="block w-full lg:hidden max-w-[300px]">
            <Carousel showArrows={true}>
            {product["product_images"].map((image,index)=>{
              return(
                <div key={index}>
                <img src={image} alt="product" />
              </div>
              )
            })}
              
            </Carousel>
          </div>
          <div className="flex min-w flex-col md:w-auto w-full gap-6 text-center md:text-left">
            <p className="font-bold text-4xl">{product.name}</p>
            <p className="text-lg font-semibold text-secondary2">{`$${product.price} SGD`}</p>
            <div className="gap-3 flex items-center flex-col md:flex-row">
              <p className="text-sm font-semibold mr-2 whitespace-nowrap">Select Size</p>
              <div className="flex gap-3">
                <SizeChoiceBox
                  size="XS"
                  handleSelect={() => {
                    setSizeChoice("XS");
                  }}
                  sizeChoice={sizeChoice}
                />
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
                  size="2XL"
                  handleSelect={() => {
                    setSizeChoice("2XL");
                  }}
                  sizeChoice={sizeChoice}
                />
              </div>
            </div>
            <div className="">
              <div className=" bg-slate-500 w-full h-lineBreakHeight max-w-lg m-auto" />

              <div className="flex md:flex-row flex-col gap-5 mt-8 max-w-lg m-auto">
                <button
                  className="border-2 border-black w-full h-12 font-semibold rounded-md hover:bg-black hover:text-white"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
                <button
                  className="border-2 border-none text-white bg-black w-full h-12 font-semibold rounded-md hover:shadow-xl shadow-indigo-800"
                  onClick={() => {
                    handleBuyNow(product);
                  }}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>Loading...</>
      )}
    </div>
  );
}

function ProductImage(props) {
  const { image, index } = props;
  return (
    <img
      src={image}
      alt="product img"
      className=" w-full h-full object-fill rounded-md"
      key={index}
    />
  );
}

function SizeChoiceBox(props) {
  const { size, handleSelect, sizeChoice } = props;
  return (
    <button
      className={`${
        sizeChoice === size ? "bg-secondary2 border-none" : ""
      } w-10 h-10 cursor-pointer rounded-lg border-2 border-slate-300 `}
      onClick={handleSelect}
    >
      <p
        className={` text-xs text-black ${
          sizeChoice === size ? " font-semibold text-white" : ""
        }`}
      >
        {size}
      </p>
    </button>
  );
}
