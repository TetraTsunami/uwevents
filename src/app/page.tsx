import { getEvents } from "./api/events/[date]/getEvents";
import InfiniteScrollEventList from "./InfiniteScrollEventList";
import { dateFormatted } from "@/UWEvent";
import dayjs from "dayjs";
import "dayjs/plugin/utc";
import "dayjs/plugin/timezone";
import "dayjs/plugin/customParseFormat";

export const dynamic = 'force-dynamic';

async function getInitialEvents() {
  dayjs.extend(require("dayjs/plugin/utc"));
  dayjs.extend(require("dayjs/plugin/timezone"));
  dayjs.extend(require("dayjs/plugin/customParseFormat"));
  const today = dayjs().tz("America/Chicago", true);
  const events =  await getEvents(dateFormatted(today.toDate()), true);
  return events.map((cls) => cls.toObject());
}

export default async function Home() {
  const initialEvents = await getInitialEvents();

  return (
    <main className="min-h-screen py-24 grid" style={{gridTemplateColumns: "1fr min(65ch, calc(100% - 64px)) 1fr"}}>
      <div className="mb-32 mx-auto col-start-2 col-end-3 grid text-center max-w-full rounded-lg border 
      px-5 py-4 transition-colors border-gray-300 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-950"
      >
        <h2 className="mb-3 text-2xl font-semibold">
          Events listing{" "}
          <span className="inline-block transition-transform motion-reduce:transform-none">
            -&gt;
          </span>
        </h2>
        <hr />
          <InfiniteScrollEventList initialEvents={initialEvents} />
      </div>
    </main>
  );
}
