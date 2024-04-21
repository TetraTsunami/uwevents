import dayjs from "dayjs";
import { useRef } from "react";
export const CategoryHeader = ({ children }: {children: any}) => (
    <h3 className="sticky top-0 p-2 text-right text-xl font-semibold">
      {children}
    </h3>
);


export const DateHeader = ({ date }: { date: dayjs.Dayjs }) => {
  const formattedDate = date.format("dddd, MMMM D YYYY");
  return (
    <h3 className="sm:text-m sticky top-0 mt-10 rounded-md border-neutral-700 bg-neutral-900/80 p-2 text-left font-semibold backdrop-blur-sm md:text-2xl">
      {formattedDate}
    </h3>
  );
};

