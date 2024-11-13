import ProductImages from "@/components/features/product/ProductImages";
import { fetchHelper } from "@/helpers/fetchHelper";
import { ProductData } from "@/types/product";
import ProductDetails from "@/components/features/product/ProductDetails";

export const dynamicParams = true;

export async function generateStaticParams() {
  const shopData = await fetchHelper<ProductData[]>(
    "http://127.0.0.1:4242/get_store_products"
  );
  return shopData.map((product, index) => ({
    id: product.id,
  }));
}

export default async function Product({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const productData = await fetchHelper<ProductData>(
      `http://127.0.0.1:4242/fetch_product?productID=${id}`
    );
    return (
        <div className="flex flex-col md:flex-row md:justify-center pb-10 gap-10 lg:gap-16 items-center h-full w-full p-5 sm:p-10">
          <ProductImages product={productData} />
          <ProductDetails product={productData} />
        </div>
    );
  } catch (err) {
    return <div>An error occured</div>;
  }
}
