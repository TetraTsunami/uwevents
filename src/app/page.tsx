import { EventPreview } from "./EventPreview";
import { CategoryHeader, DateHeader } from "./CategoryHeader";
import { getEvents, getEventsGrouped } from "./api/events/[date]/route";
import { EventCategory } from "@/UWEvent";
import EventList from "./EventList";

export default async function Home() {
  const today = new Date();
  
  const fetchInitialItems = async () => {
    const events =  await getEventsGrouped(today.toISOString().slice(0, 10), true);
    return ({date: today, 
            groups: events});
  }
  const initialEvents = await fetchInitialItems();

  
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
          {/* <EventList initialEvents={initialEvents} initialDate={today} /> */}

      </div>
    </main>
  );
}
