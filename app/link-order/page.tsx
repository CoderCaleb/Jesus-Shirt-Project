"use client";

import Button from "@/components/ui/Button";
import MessageBox from "@/components/ui/MessageBox";
import SubText from "@/components/ui/SubText";
import TitleText from "@/components/ui/TitleText";
import { doesSessionExist } from "@/helpers/authHelpers";
import { fetchHelper } from "@/helpers/fetchHelper";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const LinkOrder = () => {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderId");
  const orderToken = searchParams.get("orderToken");
  const [statusMessage, setStatusMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLinkOrder = async () => {
    if (!orderNumber || !orderToken) {
      setStatusMessage("Invalid order details. Please check the URL.");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    setStatusMessage("");
    setMessageType(null);

    try {
      console.log("order token", orderToken);
      await fetchHelper<{ message: string }>(
        "http://localhost:4242/link-order",
        {
          method: "POST",
          body: { orderNumber },
          headers: { "Order-Token": orderToken },
        },
      );

      toast.success("Order successfully linked!");
      router.push("/orders");
    } catch (error) {
      setMessageType("error");
      if (error instanceof Error) {
        setStatusMessage(error.message);
      } else {
        setStatusMessage("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const [sessionExist, setSessionExist] = useState<null | boolean>(null);

  async function checkSessionExist() {
    const isSessionExist = await doesSessionExist();
    setSessionExist(isSessionExist);
    console.log({ isSessionExist });
  }

  useEffect(() => {
    checkSessionExist();
  }, []);

  if (sessionExist === null) {
    return "Loading...";
  }

  if (!sessionExist) {
    router.push("/auth");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4">
      <TitleText text="Link Your Order" additionalStyles="mb-6" />
      <SubText
        text={`This will link order to the account that is currently signed in`}
        additionalStyles="mb-6 text-center"
      />
      <Button
        buttonText={isLoading ? "Linking..." : "Link Order"}
        onClick={handleLinkOrder}
        isDisabled={isLoading}
        additionalStyles="max-w-[200px] px-6 py-2"
      />
      {statusMessage && messageType && (
        <div className="mt-4 w-full max-w-[400px]">
          <MessageBox type={messageType} message={statusMessage} />
        </div>
      )}
    </div>
  );
};

export default LinkOrder;
