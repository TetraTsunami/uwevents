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
    <main className="min-h-screen p-2 sm:px-16 sm:py-24">
      <div className="col-start-2 col-end-3 mx-auto mb-32 grid max-w-3xl rounded-lg border border-neutral-700 bg-neutral-950/75 p-2 text-center text-white backdrop-blur-md transition-colors sm:px-5 sm:py-4"
      >
        <h2 className="mb-3 text-2xl font-semibold">
          UW-Madison Events listing
        </h2>
        <p className="mb-6">
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
      <InfiniteScrollEventList initialEvents={initialEvents} />
      </div>
    </main>
  );
}
