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
  const events =  await getEvents(dateFormatted(today.toDate()), false);
  return events.map((cls) => cls.toObject());
}

export default async function Home() {
  const initialEvents = await getInitialEvents();

  return (
    <main className="grid min-h-screen py-24" style={{gridTemplateColumns: "1fr min(65ch, calc(100% - 64px)) 1fr"}}>
      <div className="col-start-2 col-end-3 mx-auto mb-32 grid max-w-full rounded-lg border border-gray-300 bg-gray-100 px-5 py-4 text-center transition-colors dark:border-neutral-700 dark:bg-neutral-950"
      >
        <h2 className="mb-3 text-2xl font-semibold">
          UW-Madison Events listing
        </h2>
        <p className="mb-3">
          This is a listing of events happening at UW-Madison. It is
          not comprehensive, and is not endorsed by UW. You can find the
          official calendar{" "}
          <a
            href="https://today.wisc.edu/"
            target="_blank"
            className="underline hover:text-red-200 active:text-red-400"
          >
            here
          </a>
          .
        </p>
        <hr />
          <InfiniteScrollEventList initialEvents={initialEvents} />
      </div>
    </main>
  );
}
