import { getEvents } from "./api/events/[date]/getEvents";
import InfiniteScrollEventList from "./InfiniteScrollEventList";
import { dateFormatted } from "@/UWEvent";

export default async function Home() {
  const today = new Date();

  const fetchInitialItems = async () => {
    // list of event objects, but we tragically can't pass objects to client components
    const events =  await getEvents(dateFormatted(today), true);
    return events.map((cls) => cls.toObject());
  }
  const initialEvents = await fetchInitialItems();
  
  return (
    <main className="min-h-screen p-24">
      <div  className="mb-32 mx-auto grid text-center w-full max-w-2xl rounded-lg border 
      px-5 py-4 transition-colors border-gray-300 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-950 group"
      >
        <h2 className={`mb-3 text-2xl font-semibold`}>
          Events listing{" "}
          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
            -&gt;
          </span>
        </h2>
        <hr />
          <InfiniteScrollEventList initialEvents={initialEvents} initialDate={today}/>
      </div>
    </main>
  );
}
