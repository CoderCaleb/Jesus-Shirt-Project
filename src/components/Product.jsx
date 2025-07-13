import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { StateSharingContext } from "../contexts";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

const Product = () => {
  const { productId } = useParams();
  const [sizeChoice, setSizeChoice] = useState("S");
  const [product, setProduct] = useState({});
  const { setCartItems } = useContext(StateSharingContext);
  const navigate = useNavigate();

  useEffect(() => {
    handleFetchProduct(productId);
  }, [productId]);

  const handleFetchProduct = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:4242/fetch_product?productID=${id}`);
      const data = await response.json();
      setProduct(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddToCart = (productInfo) => {
    const updatedProductInfo = { ...productInfo, size: sizeChoice, quantity: 1 };
    setCartItems((prev) => {
      const productInCartIndex = prev.findIndex(
        (item) => item && item.id === product.id && item.size === updatedProductInfo.size
      );
      const updatedCart = [...prev];
      toast("Item successfully added in your cart 🛒", { type: "success" });

      if (productInCartIndex !== -1) {
        updatedCart[productInCartIndex].quantity += 1;
        return updatedCart;
      } else {
        return [...prev, updatedProductInfo];
      }
    });
  };

  const handleBuyNow = (productInfo) => {
    const productArr = [{ ...productInfo, size: sizeChoice, quantity: 1 }];
    navigate("/checkout", { state: { checkoutItems: productArr } });
  };

  return (
    <div className="w-full overflow-y-scroll p-5 sm:p-10">
      {Object.keys(product).length !== 0 ? (
        <div className="flex flex-col md:flex-row md:justify-center pb-10 gap-10 lg:gap-16 items-center h-full w-full">
          <ProductImages product={product} />
          <ProductDetails
            product={product}
            sizeChoice={sizeChoice}
            setSizeChoice={setSizeChoice}
            handleAddToCart={handleAddToCart}
            handleBuyNow={handleBuyNow}
          />
        </div>
      ) : (
        <>Loading...</>
      )}
    </div>
  );
};

const ProductImages = ({ product }) => {
  return (
    <>
      <div className="grid-cols-2 gap-4 w-6/12 max-w-maxImageGridWidth h-min hidden min-w-minPictureGrid lg:grid">
        {product.product_images.map((image, index) => (
          <ProductImage image={image} key={index} />
        ))}
      </div>
      <div className="block w-full lg:hidden max-w-[600px] sm:max-w-[350px]">
        <Carousel showArrows={true}>
          {product.product_images.map((image, index) => (
            <div key={index}>
              <img src={image} alt="product" />
            </div>
          ))}
        </Carousel>
      </div>
    </>
  );
};

const ProductDetails = ({ product, sizeChoice, setSizeChoice, handleAddToCart, handleBuyNow }) => {
  return (
    <div className="flex min-w flex-col md:w-auto w-full gap-6 text-center md:text-left">
      <p className="font-bold text-4xl">{product.name}</p>
      <p className="text-lg font-semibold">{`$${product.price} SGD`}</p>
      <SizeSelector sizeChoice={sizeChoice} setSizeChoice={setSizeChoice} />
      <div className=" bg-slate-400 w-full h-lineBreakHeight" />
      <div className="flex md:flex-row flex-col gap-5 max-w-lg w-full">
        <button
          className="border-2 border-black flex-1 h-12 font-semibold rounded-md hover:bg-black hover:text-white"
          onClick={() => handleAddToCart(product)}
        >
          Add to Cart
        </button>
        <button
          className="border-none text-white bg-black flex-1 h-12 font-semibold rounded-md hover:shadow-xl shadow-indigo-800"
          onClick={() => handleBuyNow(product)}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

const SizeSelector = ({ sizeChoice, setSizeChoice }) => {
  const sizes = ["XS", "S", "M", "L", "XL", "2XL"];
  return (
    <div className="gap-3 flex items-center flex-col md:flex-row">
      <p className="text-sm font-semibold mr-2 whitespace-nowrap">Select Size</p>
      <div className="flex gap-3">
        {sizes.map((size) => (
          <SizeChoiceBox
            key={size}
            size={size}
            handleSelect={() => setSizeChoice(size)}
            sizeChoice={sizeChoice}
          />
        ))}
      </div>
    </div>
  );
};

const ProductImage = ({ image }) => {
  return (
    <img src={image} alt="product img" className="w-full h-full object-fill rounded-md" />
  );
};

const SizeChoiceBox = ({ size, handleSelect, sizeChoice }) => {
  return (
    <button
      className={`${
        sizeChoice === size ? "bg-secondary2 border-none" : ""
      } w-10 h-10 cursor-pointer rounded-lg border-2 border-slate-300 `}
      onClick={handleSelect}
    >
      <p className={`text-xs text-black ${sizeChoice === size ? "font-semibold text-white" : ""}`}>
        {size}
      </p>
    </button>
  );
};

export default Product;
