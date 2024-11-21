import Image from "next/image";

const PaymentLoadingOverlay = () => (
  <div className="flex flex-col gap-5 absolute w-full h-full justify-center items-center bg-darkenBg z-50">
    <Image
      src={"/images/payment-loading.gif"}
      alt="Processing payment animation"
      width={192}
      height={192}
    />
    <p className="font-semibold text-lg text-white">
      Processing payment. Please wait...
    </p>
  </div>
);

export default PaymentLoadingOverlay;
