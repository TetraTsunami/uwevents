import { Moment } from "moment";
import { type } from "os";

export enum EventCategory {
    AllDay = "All Day",
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
    title;
    subtitle;
    time;
    location;
    type;

    constructor(title: string, subtitle: string, time: EventDuration, location: string) {
        this.title = title;
        this.subtitle = subtitle;
        this.time = time;
        this.location = location;
        // hueristic to determine the type of event
        if (time.allDay) {
            this.type = EventCategory.AllDay;
        } else if (matchesAny([title, subtitle], [/Let's Talk/i, /Table/i])) {
            this.type = EventCategory.LetsTalk;
        } else if (matchesAny([title, subtitle], [/Meeting/i, /WUD/i, /Club/i, /Committee/i])) {
           this.type = EventCategory.ClubMeeting;
        } else if (matchesAny([title, subtitle], [/Lecture/i, /Speaker/i, /Talk/i, /Seminar/i])) {
            this.type = EventCategory.Lecture;
        } else if (matchesAny([title, subtitle], [/Office Hours/i, /Drop.In/i])) {
            this.type = EventCategory.DropIn;
        } else if (matchesAny([title, subtitle], [/Meeting/i, /Meetup/i, /Breakfast/i, /Lunch/i, /Dinner/i])) {
            this.type = EventCategory.Meeting;
        } else {
            this.type = EventCategory.Other;
        }
    }
    toString() {
        let str = `${this.title}`;
        if (this.subtitle != "") {
            str += `\n\t${this.subtitle}`;
        }
        str += `\n\t${this.time.toString()}`;
        str += `\n\t${this.location}`;
        return str;
    }
}
export class EventDuration {
    start;
    end;
    /**
     * Represents the event being a drop in event, where you can come and go as you please.
     * This is determined by the event being longer than 6 hours.
     * This effects how the event is displayed.
     */
    allDay = false;
    /**
     * Represents the event being a repeating event, where it happens on a regular basis.
     * Ideally daily things.
     */
    repeating = false;

    constructor(start: Moment | undefined, end: Moment | undefined) {
        // potentially valid times: All day, 9am, 9am-4pm, 1-4pm
        // I am assuming that everything is in the same day. this will not come back to bite me
        if (start == undefined) {
            this.allDay = true;
        }
        else {
            this.start = start;
            this.end = end;
            // for our purposes, anything over 6 hours is probably "drop in"
            this.allDay = (end != undefined && end.diff(start, "hours") >= 6);
        }
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