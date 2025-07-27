import Image from "next/image";
import { FaGithub } from "react-icons/fa";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          <div className="flex flex-col items-center gap-5">
            <p className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
              Hop on to /shop to browse products{" "}
            </p>
            <p className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
              {"Feel free to try out all the features :)"}
            </p>
          </div>

          <div className="flex gap-4 items-center flex-col sm:flex-row m-auto">
            <a
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-black text-background gap-2 hover:bg-[#383838] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
              href="https://github.com/CoderCaleb/Jesus-Shirt-Project/tree/next-migration"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub size={25} />
              View Github code
            </a>
          </div>
        </main>
      </div>
    </div>
  );
}
