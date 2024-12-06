import React from "react";
import Dot from "./Dot";

type OrderTimelineProps = {
  timelineStatus: string[];
  orderDate: Date;
  index: number;
};

const OrderTimeline: React.FC<OrderTimelineProps> = ({
  timelineStatus,
  orderDate,
  index,
}) => {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "2-digit",
    year: "numeric",
  };

  let prevDate = orderDate;
  const timeStatuses = timelineStatus.map((_, idx) => {
    const currentDate = new Date(
      prevDate.getTime() + (idx + 2) * 24 * 60 * 60 * 1000,
    ).toLocaleDateString("en-US", options);
    prevDate = new Date(currentDate);
    return currentDate;
  });

  return (
    <div className="grid w-full md:px-7 mt-7 sm:grid-cols-4 grid-cols-2">
      {timelineStatus.map((status, idx) => (
        <Dot
          key={idx}
          dotStatus={status}
          index={idx}
          currentIndex={index}
          timeStatuses={timeStatuses}
        />
      ))}
    </div>
  );
};

export default OrderTimeline;
