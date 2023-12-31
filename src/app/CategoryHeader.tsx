import dayjs from "dayjs";
export const CategoryHeader = ({ children }: {children: any}) => (
    <h3 className="bg-gradient-to-t from-transparent to-neutral-950 py-2 text-xl font-semibold">
      {children}
    </h3>
);


export const DateHeader = ({ date }: { date: dayjs.Dayjs }) => {
  const formattedDate = date.format("dddd, MMMM D YYYY");
  return (
    <>
      <h3 className="bg-gradient-to-t from-transparent to-neutral-950 py-2 md:text-2xl font-semibold sticky top-0 sm:text-m">
        {formattedDate}
      </h3>
      <hr />
    </>
  );
};

