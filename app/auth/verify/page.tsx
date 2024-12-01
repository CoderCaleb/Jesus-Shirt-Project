"use client";
import Button from "@/components/ui/Button";
import SubText from "@/components/ui/SubText";
import TitleText from "@/components/ui/TitleText";
import { handleMagicLinkClicked } from "@/helpers/authHelpers";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const VerifyPage = () => {
  const router = useRouter();
  const [status, setStatus] = useState<
    "loading" | "error" | "success" | "idle"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [requiresConfirmation, setRequiresConfirmation] =
    useState<boolean>(true);

  const divStyles =
    "text-center flex flex-col justify-center items-center gap-5";

  useEffect(() => {
    if (!requiresConfirmation) {
      handleMagicLinkClicked(router, setStatus, setErrorMessage);
    }
  }, [router, requiresConfirmation]);

  const handleConfirmation = () => {
    setRequiresConfirmation(false);
  };

  return (
    <div className="flex justify-center items-center w-1/2 max-w-[450px] min-w-[300px] m-auto h-full">
      {requiresConfirmation && (
        <div className={divStyles}>
          <TitleText
            text="Are you logging in on this device?"
            additionalStyles="!font-semibold"
          />
          <SubText text="Click the button below to confirm your login on this device." />
          <Button
            buttonText="Yes, continue"
            buttonType="black"
            additionalStyles="w-32"
            onClick={handleConfirmation}
          />
        </div>
      )}
      {!requiresConfirmation && status === "loading" && (
        <div className={divStyles}>
          <p>Verifying your magic link...</p>
        </div>
      )}
      {!requiresConfirmation && status === "error" && (
        <div className={divStyles}>
          <div className=" w-5/6 aspect-square relative">
            <Image
              src="/images/Transaction-Error.png"
              fill
              alt="transaction error"
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 35vw, 50vw"
            />
          </div>
          <TitleText
            text="That link doesn’t seem to work"
            additionalStyles="!font-semibold"
          />
          <SubText text={errorMessage} />
          <Button
            buttonText="Get a new link"
            buttonType="black"
            additionalStyles="w-40"
            onClick={() => {
              router.push("/auth");
            }}
          />
        </div>
      )}
    </div>
  );
};

export default VerifyPage;
