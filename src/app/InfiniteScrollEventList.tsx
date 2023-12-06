"use client";
// @refresh reset
import React, { useState, useEffect } from "react";
import { ScheduledEvent, TypedEventGroup, dateFormatted } from "../UWEvent";
// @ts-ignore
import InfiniteScroll from "react-infinite-scroller";
import { CategoryHeader, DateHeader } from "./CategoryHeader";
import { EventPreview } from "./EventPreview";
import moment from "moment";
import { groupEvents, EventDuration } from "@/UWEvent";

export default function InfiniteScrollEventList({
    initialEvents,
    initialDate,
}: {
    initialEvents: any; // has to be any because we can't pass classes to client components, so we need to rehydrate the types first
    initialDate: Date;
}) {
    const fetching = React.useRef(false);
    const [date, setDate] = React.useState(moment(initialDate));
    // split initial events by groups
    const initialEventsGrouped = groupEvents(initialEvents.map((obj: any) => ScheduledEvent.fromObject(obj)));
    const [calendar, setCalendar] = React.useState([{
        date: date,
        groups: initialEventsGrouped}]);

    // fetch more events, then split those by groups too!
    const loadMore = async (page: number) => {
        if (!fetching.current) {
            try {
                fetching.current = true;
                const newDate = date.clone().add(1, "day");
                const response = await fetch(
                    `/api/events/${dateFormatted(newDate.toDate())}`
                );
                const data = await response.json();
                const events = data.map((obj: any) => ScheduledEvent.fromObject(obj));
                const groups = groupEvents(events);
                setCalendar((prev) => [...prev, {date: newDate, groups: groups}]);
                setDate((prev) => newDate);
            } finally {
                fetching.current = false;
            }
        }
    };
        

    return (
        <InfiniteScroll
            pageStart={0}
            loadMore={loadMore}
            hasMore={true}
            loader={<div className="loader" key={0}>Loading ...</div>}
        >
            {calendar.map((day, index) => (
                <div key={day.date.toString()}>
                    <DateHeader date={day.date.toDate()} />
                    {day.groups.map((group, index) => (
                        <div key={group.type}>
                            <CategoryHeader>{group.type}</CategoryHeader>
                            {group.events.map((event, index) => (
                                <EventPreview key={index} event={event} />
                            ))}
                        </div>
                    ))}
                </div>
            ))}
        </InfiniteScroll>
    );
}