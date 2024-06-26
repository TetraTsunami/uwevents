import dayjs from "dayjs";

export enum EventCategory {
    AllDay = "All Day",
    Sports = "Sports",
    ClubMeeting = "Club",
    Lecture = "Lecture",
    DropIn = "Drop-in",
    Meeting = "Meetup",
    LetsTalk = "Let's Talk",
    Other = "Other",
}

// this is an abomination unto the lord but it does function soooo
const matchesAny = (strs: string[], regexes: RegExp[]) => regexes.some((regex) => strs.some((str) => str && regex.test(str)));

export type TypedEventGroup = {
    type: EventCategory;
    events: ScheduledEvent[];
}
  
export class ScheduledEvent {
    id;
    title;
    subtitle;
    description;
    time;
    locations;
    link;
    type;
    constructor(id: string, title: string, subtitle: string, description: string, time: EventDuration, locations: (UWLocation[] | undefined) , link: string) {
        this.id = id;
        this.title = title;
        this.subtitle = subtitle;
        this.description = description;
        this.time = time;
        this.locations = locations || [];
        this.link = link;
        // hueristic to determine the type of event
        if (time.dropIn) {
            this.type = EventCategory.AllDay;
        } else if (matchesAny([title, subtitle], [/Let's Talk/i, /Table/i])) {
            this.type = EventCategory.LetsTalk;
        } else if (matchesAny([title, subtitle, description], [/Meeting/i, /WUD/i, /Club/i, /Committee/i])) {
           this.type = EventCategory.ClubMeeting;
        } else if (matchesAny([title, subtitle], [/Lecture/i, /Speaker/i, /Talk/i, /Seminar/i])) {
            this.type = EventCategory.Lecture;
        } else if (matchesAny([title, subtitle], [/Office Hours/i, /Drop.In/i])) {
            this.type = EventCategory.DropIn;
        } else if (matchesAny([title, subtitle], [/Meeting/i, /Meetup/i, /Breakfast/i, /Lunch/i, /Dinner/i])) {
            this.type = EventCategory.Meeting;
        } else if (matchesAny([title, subtitle, this.locations[0]?.name ?? ""], [/Stadium/i, /Field House/i, /Randall/i, /Gym/i, /Court/i, /UW vs\./i, /Wisconsin vs\./i, 
                /Football/i, /Softball/i, /Tennis/i, /Hockey/i, /Soccer/i, /Volleyball/i, /Basketball/i, /Wrestling/i])) {
            this.type = EventCategory.Sports;
        } else {
            this.type = EventCategory.Other;
        }
    }
    googleCalendarLink() {
        let start = (!this.time.allDay ? this.time.start.toISOString() : this.time.start.format("YYYY-MM-DD")).replace(/-|:|\.\d+/g, '');
        let end = (!this.time.allDay ? this.time.end.toISOString() : this.time.end.format("YYYY-MM-DD")).replace(/-|:|\.\d+/g, '');
        let title = encodeURIComponent(this.title)
        let description = encodeURIComponent(this.description);
        let location = encodeURIComponent(this.locations[0]?.name);
        let url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${description}&location=${location}`;
        return url;
    }
    toString() {
        let str = `${this.title}`;
        if (this.subtitle != "") {
            str += `\n\t${this.subtitle}`;
        }
        str += `\n\t${this.time.toString()}`;
        str += `\n\t${this.locations[0]?.name}`;
        return str;
    }
    toObject() {
        const {...obj} = this;
        let time = {
            start: this.time.start?.toISOString(),
            end: this.time.end?.toISOString(),
            allDay: this.time.allDay,
        }
        // @ts-ignore
        obj.time = time;
        return obj;
    }
    static fromObject(obj: any) {   
        let start = dayjs(obj.time.start).tz("America/Chicago");
        let end = dayjs(obj.time.end).tz("America/Chicago");
        const event = new ScheduledEvent(obj.id, obj.title, obj.subtitle, obj.description, new EventDuration(start, end , obj.time.allDay), 
            obj.locations, obj.link);
        return event;
    }
}

export interface UWLocation {
    name: string;
    link: string;

}
export class EventDuration {
    start;
    end;
    /**
     * Represents the event being an all day event. Affects the categorization and display of the event.
     */
    allDay = false;
    /**
     * Represents the event being a drop in event, where you can come and go as you please.
     * This is determined by the event being longer than 6 hours.
     * This affects the categorization of the event.
     */
    dropIn = false;
    /**
     * Represents the event being a repeating event, where it happens on a regular basis.
     * Ideally daily things.
     */
    repeating = false;

    constructor(start: dayjs.Dayjs, end: dayjs.Dayjs, allDay = false) {
        // potentially valid times: All day, 9am, 9am-4pm, 1-4pm
        // I am assuming that everything is in the same day. this will not come back to bite me
        this.allDay = allDay;
        this.start = start;
        this.end = end;
        // for our purposes, anything over 6 hours is probably "drop in"
        this.dropIn = (end != undefined && end.diff(start, "hours") >= 6);
    }
    toString() {
        if (this.allDay) {
            return "All day";
        }
        if (this.start && this.end) {
            if (this.start.isSame(this.end)) {
                return this.start.format("h:mma");
            } else {
                return `${this.start.format("h:mma")}-${this.end.format("h:mma")}`;
            }
        } else {
            return "Invalid time";
        }
    }
}

export const groupEvents = (events: ScheduledEvent[]) => {
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

  const categoryOrder = Object.values(EventCategory);
  const sortedByCategory = byCategory.sort((a, b) => categoryOrder.indexOf(a.type) - categoryOrder.indexOf(b.type));

  return sortedByCategory;
};
export const dateFormatted = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/*
structure of the html
<h1 class="day-row-header">
    <a href="/events/day/2023-11-19">Today, November 19, 2023</a>
</h1>

<div class="events-list">
    <ul class="day-row">

<li class="event-row" id="0000000" style="border-top: none;; display: block">
    <div class="event-details">
        <h3 class="event-title">
            <a href="/events/view/189438">EVENT TITLE!!!</a>
        </h3>
        could have <p class="subtitle">Some subtitle</p>
        <p class="event-time"> // TIME!!!
            <i class="fa fa-clock-o"></i>
            <span class="time-hm">12</span>-<span class="time-hm">4</span> p.m.
        </p>
        might instead be just <p>All day</p>
        <p class="event-location"> // LOCATION!!!
            <i class="fa fa-map-marker"></i>
            Class of 1973 Gallery, 2nd Floor, <a class="location_link" href="https://map.wisc.edu/?initObj=0020">Armory and Gymnasium (Red Gym)</a>
        </p>
    </div>
</li>
<li>...</li>

    </ul>
</div>
*/