import ProductImages from "@/components/features/product/ProductImages";
import { fetchHelper } from "@/helpers/fetchHelper";
import { ProductData } from "@/types/product";
import ProductDetails from "@/components/features/product/ProductDetails";

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const shopData = await fetchHelper<ProductData[]>(
      "http://127.0.0.1:4242/get_store_products",
    );
    if (!shopData || shopData.length === 0) {
      return [];
    }
    return shopData.map((product) => ({
      id: product.id,
    }));
  } catch (error) {
    console.error("Error fetching product data:", error);
    return [];
  }
}

export default async function Product({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const productData = await fetchHelper<ProductData>(
      `http://127.0.0.1:4242/fetch_product?productID=${id}`,
    );
    return (
      <div className="flex flex-col md:flex-row md:justify-center pb-10 gap-10 lg:gap-16 items-center h-full w-full p-5 sm:p-10">
        <ProductImages product={productData} />
        <ProductDetails product={productData} />
      </div>
    );
  } catch (error:unknown) {
    console.error("Error occurred:", error); 
    return (
      <div className="flex justify-center items-center h-full w-full p-10">
        <div className="text-center">
          <p className="text-xl font-semibold text-red-500">
            An error occurred
          </p>
          <p className="mt-2 text-gray-700">
            We couldn&apos;t load the product details. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}
