import React from "react";

type DotProps = {
  dotStatus: string;
  index: number;
  currentIndex: number;
  timeStatuses: string[];
};

const Dot: React.FC<DotProps> = ({
  dotStatus,
  index,
  currentIndex,
  timeStatuses,
}) => (
  <div className="flex flex-1 flex-col gap-3 items-center relative" key={index}>
    <p
      className={`font-semibold text-center ${
        index <= currentIndex ? "text-successGreen" : " text-[#9ea7bb]"
      }`}
    >
      {dotStatus}
    </p>
    <div className="flex w-full items-center">
      <div
        className={`flex-1 h-1 ${
          index <= currentIndex ? "bg-successGreen" : "bg-[#9ea7bb]"
        }`}
      ></div>
      <div
        className={`w-5 h-5 rounded-3xl ${
          index <= currentIndex ? "bg-successGreen" : "bg-[#9ea7bb]"
        }`}
      ></div>
      <div
        className={`flex-1 h-1 ${
          index <= currentIndex ? "bg-successGreen" : "bg-[#9ea7bb]"
        }`}
      ></div>
    </div>
    <p className="text-sm text-slate-600 font-semibold">
      {timeStatuses[index]}
    </p>
  </div>
);

export default Dot;
