import { EventPreview } from "@/app/EventPreview";
import { CategoryHeader, DateHeader } from "@/app/CategoryHeader";
import { getEventsGrouped } from "@/app/api/events/[date]/route";

export default async function SpecificDate({ params }: { params: { date: string } }) {
  // verify that the date is valid
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(params.date)) {
    return Response.redirect("/404");
  }
  const eventsGrouped = await getEventsGrouped(params.date, true);
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div  className="mb-32 grid text-center w-full max-w-2xl rounded-lg border 
      px-5 py-4 transition-colors border-gray-300 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-950 group"
      >
        <h2 className={`mb-3 text-2xl font-semibold`}>
          Events listing{" "}
          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
            -&gt;
          </span>
        </h2>
        <hr />
        <DateHeader date={new Date(params.date.replace("-", "/"))} />
        {eventsGrouped.map((group, index) => (
          <div key={index}>
            <CategoryHeader sticky={false}>{group.type}</CategoryHeader>
            {group.events.map((event, index) => (
              <EventPreview key={index} event={event} />
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}
