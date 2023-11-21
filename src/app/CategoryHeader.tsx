import moment from "moment";
export const CategoryHeader = ({ children, sticky}: {children: any, sticky: boolean}) => (
    <h3 className="bg-gradient-to-t from-transparent to-neutral-950 py-2 text-xl font-semibold"
      style={sticky ? {position: "sticky", top: "0"} : {}} >
      {children}
    </h3>
);


export const DateHeader = ({ date }: { date: Date; }) => {
  const formattedDate = moment(date).format("dddd, MMMM Do YYYY");
  return (
    <CategoryHeader sticky={true}>{formattedDate}</CategoryHeader>
  );
};

