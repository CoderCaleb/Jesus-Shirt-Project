import Carousel from "@/components/ui/Carousel";
import { ProductData } from "@/types/product";
import Image from "next/image";

const ProductImages = ({ product }: { product: ProductData }) => {
  return (
    <>
      <div className="grid-cols-2 gap-4 w-1/2 max-w-maxImageGridWidth h-min hidden min-w-minPictureGrid lg:grid">
        {product.product_images.map((image, index) => (
          <div className="relative w-full aspect-square" key={index}>
            <Image
              src={image}
              alt={`product image ${index}`}
              fill
              className="object-cover"
              sizes="
            (max-width: 640px) 100vw,
            (max-width: 1024px) 50vw,
            33vw
          "
            />
          </div>
        ))}
      </div>
      <div className="block w-full lg:hidden max-w-[600px] sm:max-w-[350px]">
        <Carousel
          slides={product.product_images.map((image, index) => (
            <div key={index} className="embla__slide w-full aspect-square">
              <Image
                src={image}
                alt={`product`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              />
            </div>
          ))}
        />
      </div>
    </>
  );
};

export default ProductImages;
