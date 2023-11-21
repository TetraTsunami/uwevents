import * as cheerio from "cheerio";
import moment from "moment";
import { ScheduledEvent, EventDuration, EventCategory, TypedEventGroup } from "@/UWEvent";

export const getEvents = async (date: String, includeEnded: Boolean = false) => {
  let events: ScheduledEvent[] = [];
  const res = await fetch("http://today.wisc.edu/events/day/" + date);
  const $ = cheerio.load(await res.text());
  let today = $('h1.day-row-header > a').text(); // "Today, November 19, 2023"
  $('div.events-list > ul.day-row > li.event-row').each((i, el) => {
    const title = $(el).find('h3.event-title > a').text();
    let duration;
    if ($(el).find('p:not([class])').text() == "All day") {
      duration = new EventDuration(undefined, undefined);
    }
    else {
      const time = $(el).find('p.event-time').text().replace(/[\s\.]/g, "");
      const timeParts = time.split("-");
      // 9am, 1-4pm, 9:15am, 1:15-4:30pm
      if (timeParts.length == 1) {
        timeParts[1] = timeParts[0];
      }
      const end = moment(timeParts[1], ["h:mma", "ha"]);
      // deal with cases like 1-4pm, 1:15-4:30pm
      if (!timeParts[0].endsWith("m")) {
        timeParts[0] += timeParts[1].substring(timeParts[1].length - 2);
      }
      // don't include events that have already ended 
      if (!includeEnded && end.isBefore(moment())) {
        return;
      }
      const start = moment(timeParts[0], ["h:mma", "ha"]);
      duration = new EventDuration(start, end);
    }
    const subtitle = $(el).find('p.subtitle').text().replace(/[\n\.]/g, "");
    let location = $(el).find('p.event-location').children().toString().replace(/<i class="fa.*?\/i>/g, "");
    location = location.split("<br>").filter(s => s != "").join(" - ");
    location = location.replace(/<i.*?>(.*?)<\/i>/, "$1");
    events.push(new ScheduledEvent(title, subtitle, duration, location));
  });
  return events;
};

/**
 * Returns a list of events grouped by categories (e.g. all day, club meeting, lecture, etc.)
 * @param date date in YYYY-MM-DD format
 * @param includeEnded whether to include events that have already ended (false)
 */
export const getEventsGrouped = async (date: String, includeEnded: Boolean = false) => {
  let events = await getEvents(date, includeEnded);
  // split by event.type
  let byCategory = events.reduce((accumulator, event) => {
    const key = event.type;
    // if there's no group with this key, create one
    let group = accumulator.find(group => group.type == key);
    if (!group) {
      group = {
        type: key,
        events: []
      };
      accumulator.push(group);
    }
    group.events.push(event);
    return accumulator;
  }, [] as TypedEventGroup[]);

  const categoryOrder = Object.values(EventCategory)
  const sortedByCategory = byCategory.sort((a, b) => categoryOrder.indexOf(a.type) - categoryOrder.indexOf(b.type))

  return sortedByCategory
}

export const GET = async (request: Request, { params }: { params: { date: string } }) => {
  // validate date: YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(params.date)) {
    return Response.redirect("/api/events");
  }
  return Response.json(await getEventsGrouped(params.date));
}