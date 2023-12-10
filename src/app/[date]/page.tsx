import { EventPreview } from "@/app/EventPreview";
import { CategoryHeader, DateHeader } from "@/app/CategoryHeader";
import { getEventsGrouped } from "../api/events/[date]/getEvents";
import dayjs from "dayjs";
import "dayjs/plugin/utc";
import "dayjs/plugin/timezone";
import "dayjs/plugin/customParseFormat";
import { notFound } from "next/navigation";
import { dateFormatted } from "@/UWEvent";

async function getInitialEvents(date: dayjs.Dayjs) {
  return await getEventsGrouped(dateFormatted(date.toDate()), true);
}

export default async function SpecificDate({ params }: { params: { date: string } }) {
  dayjs.extend(require("dayjs/plugin/utc"));
  dayjs.extend(require("dayjs/plugin/timezone"));
  dayjs.extend(require("dayjs/plugin/customParseFormat"));

  const date = dayjs(params.date, "YYYY-MM-DD", true).tz("America/Chicago", true);
  if (!date.isValid()) {
    notFound();
  }
  const eventsGrouped = await getInitialEvents(date);
  
  return (
    <main className="min-h-screen py-24 grid" style={{gridTemplateColumns: "1fr min(65ch, calc(100% - 64px)) 1fr"}}>
      <div className="mb-32 mx-auto col-start-2 col-end-3 grid text-center max-w-full rounded-lg border 
      px-5 py-4 transition-colors border-gray-300 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-950"
      >
        <h2 className="mb-3 text-2xl font-semibold break-words">
          Events listing
        </h2>
        <hr />
        <DateHeader date={date} />
        {eventsGrouped.map((group, index) => (
          <div key={index}>
            <CategoryHeader>{group.type}</CategoryHeader>
            {group.events.map((event, index) => (
              <EventPreview key={index} event={event} />
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}
