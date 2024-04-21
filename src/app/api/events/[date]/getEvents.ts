import * as cheerio from "cheerio";
import dayjs from "dayjs";
import { ScheduledEvent, EventDuration as EventDuration, groupEvents } from "@/UWEvent";

export const getEvents = async (date: string, includeEnded: boolean = true) => {
  let events: ScheduledEvent[] = [];
  const res = await fetch("http://today.wisc.edu/events/day/" + date);
  const $ = cheerio.load(await res.text());
  let today = $('h1.day-row-header > a').text(); // "Today, November 19, 2023"
  for (const el of $('div.events-list > ul.day-row > li.event-row')) {
    // 
    // Title
    // 
    const title = $(el).find('h3.event-title > a').text();
    // 
    // Duration
    // 
    let duration;
    if ($(el).find('p:not([class])').text() == "All day") {
      duration = new EventDuration(dayjs(date, "YYYY-MM-DD"), dayjs(date, "YYYY-MM-DD").endOf("day"), true);
    }
    else {
      const time = $(el).find('p.event-time').text().replace(/[\s\.]/g, "");
      const timeParts = time.split("-");
      // 9am, 1-4pm, 9:15am, 1:15-4:30pm
      if (timeParts.length == 1) {
        timeParts[1] = timeParts[0];
      }
      const end = dayjs(date + " " + timeParts[1].replace(".", ""), ["YYYY-MM-DD h:mma", "YYYY-MM-DD ha"]);
      // deal with cases like 1-4pm, 1:15-4:30pm
      if (!timeParts[0].endsWith("m")) {
        timeParts[0] += timeParts[1].substring(timeParts[1].length - 2);
      }
      // don't include events that have already ended 
      if (!includeEnded && end.isBefore(dayjs())) {
        continue;
      }
      const start = dayjs(date + " " + timeParts[0].replace(".", ""), ["YYYY-MM-DD h:mma", "YYYY-MM-DD ha"]);
      duration = new EventDuration(start, end);
      
    }
    // 
    // Subtitle
    // 
    const subtitle = $(el).find('p.subtitle').text().replace(/[\n\.]/g, "");
    // 
    // Location 
    // (as html, to preserve links)
    let location = $(el).find('p.event-location > a').map((_, el) => ({
      name: $(el).text(),
      link: $(el).attr("href") as string
    })).get();
    // 
    // Link to event page
    // 
    let link = $(el).find('h3.event-title > a').attr("href")!;
    // add domain to relative links
    if (link.startsWith("/")) {
      link = "https://today.wisc.edu" + link;
    }
    // 
    // ID and description 
    //
    const id = $(el).attr("id")!;
    const description = await getEventDescription(id);
    events.push(new ScheduledEvent(id, title, subtitle, description, duration, location, link));
  }
  if (events.length == 0) {
    throw new Error("No events found for " + date);
  }
  return events;
};

const getEventDescription = async (id: string) => {
  const res = await fetch("http://today.wisc.edu/events/view/" + id);
  const $ = cheerio.load(await res.text());
  return $('div.event-description').find("br").replaceWith("\n").end().text().trim();
};

export const getEventsGrouped = async (date: string, includeEnded: boolean = true) => {
  let events = await getEvents(date, includeEnded);
  return groupEvents(events);
};