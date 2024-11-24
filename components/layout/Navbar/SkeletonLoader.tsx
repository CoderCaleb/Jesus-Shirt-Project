import { Skeleton, SVGSkeleton } from "./SkeletonComponents";

const LoadingSkeleton = () => (
  <>
    <div className="relative px-6 flex justify-between items-center w-full shadow-md z-40 h-[64px] bg-white">
      <a>
        <Skeleton className="w-[56px] max-w-full" />
      </a>
      <div className="flex gap-5 items-center z-10 justify-center">
        <div className="md:flex gap-5 hidden">
          <div className="mr-2">
            <SVGSkeleton className="w-[22px] h-[22px]" />
          </div>
        </div>
        <div className="flex justify-center">
          <SVGSkeleton className="w-[22px] h-[22px]" />
          <div className="hidden flex-col absolute shadow-md shadow-slate-400 top-10 group-hover:flex z-10">
            <div className="flex items-center justify-center w-full h-10 px-3">
              <Skeleton className="w-[56px] max-w-full" />
            </div>
            <div className="flex items-center justify-center w-full h-10 px-3">
              <Skeleton className="w-[48px] max-w-full" />
            </div>
            <div className="flex items-center justify-center w-full h-10 px-3">
              <Skeleton className="w-[48px] max-w-full" />
            </div>
          </div>
        </div>
        <div className="md:flex gap-5 hidden">
          <div className="mr-2">
            <Skeleton className="w-[32px] max-w-full" />
          </div>
        </div>
        <div className="md:hidden flex gap-3">
          <div className="flex flex-col justify-center items-center w-5">
            <span className="block h-1 w-full -translate-y-0.5"></span>
            <span className="block h-1 w-full my-0.5"></span>
            <span className="block h-1 w-full translate-y-0.5"></span>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default LoadingSkeleton;
