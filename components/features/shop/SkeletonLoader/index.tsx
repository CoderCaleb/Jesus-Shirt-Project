export default function SkeletonLoader() {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-auto md:w-full gap-3 md:gap-3 justify-center">
        {Array.from({ length: 8 }).map((_, index) => (
          <div className="w-full animate-pulse" key={index}>
            <div className="rounded-md bg-gray-300 h-48 w-full"></div>
            <div className="mt-3 h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="mt-2 h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }
  