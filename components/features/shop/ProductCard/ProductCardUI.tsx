import { useRouter } from "next/navigation";
import Image from "next/image";

function ProductCardUI({
  thumbnailUrl,
  name,
  price,
  id,
}: {
  thumbnailUrl: string;
  name: string;
  price: string;
  id: string;
}) {
  const router = useRouter();

  const handleNavigation = () => {
    router.push(`/shop/${id}`);
  };

  return (
    <div className="w-full h-full" key={id}>
      <div
        className="rounded-md overflow-hidden w-full flex flex-col gap-2 items-center justify-center cursor-pointer transition-all duration-150 bg-cardColorOne shadow-lg hover:shadow-slate-300 relative aspect-square"
        onClick={handleNavigation}
      >
        <Image
          src={thumbnailUrl}
          alt={`${name} thumbnail`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>
      <div className="my-3 font-semibold text-lg">
        <p className="inline-block">{name}</p>
        <p className="text-base">{`$${price}`}</p>
      </div>
    </div>
  );
}

export default ProductCardUI;
