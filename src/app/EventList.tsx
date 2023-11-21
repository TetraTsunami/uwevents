"use client";
import React, { useState, useEffect } from "react";
import { TypedEventGroup } from "../UWEvent";
// @ts-ignore
import InfiniteScroll from "react-infinite-scroller";
import { CategoryHeader, DateHeader } from "./CategoryHeader";
import { EventPreview } from "./EventPreview";

export default function EventList({
    initialEvents,
    initialDate,
}: {
    initialEvents: { date: Date,
                     groups: TypedEventGroup[] };
    initialDate: Date;
}) {
    const fetching = React.useRef(false);
    const [events, setEvents] = React.useState([initialEvents]);
    const [date, setDate] = React.useState(initialDate);

    const loadMore = async (page: number) => {
        if (!fetching.current) {
            try {
                fetching.current = true;
                setDate((prev) => {
                    const newDate = new Date(prev);
                    newDate.setDate(newDate.getDate() - 1);
                    return newDate;
                });
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_HOSTNAME}/api/events/${date.toISOString().slice(0, 10)}`
                );
                const data = await response.json();
                setEvents((prev) => [...prev, {date: date, groups: [...data]}]);
            } finally {
                fetching.current = false;
            }
        }
    };

    return (
        // <InfiniteScroll
        //     hasMore
        //     pageStart={0}
        //     loadMore={loadMore}
        //     loader={
        //         <span key={0} className="loader">
        //             Loading ...
        //         </span>
        //     }
        // >
        //     {/* {events.map((day, index) => (
        //         <div key={index}>
        //             <DateHeader date={day.date} />
        //             {day.groups.map((group, index) => (
        //                 <>
        //                     <CategoryHeader sticky={false}>{group.type}</CategoryHeader>
        //                     {group.events.map((event, index) => (
        //                         <EventPreview key={index} event={event} />
        //                     ))}
        //                 </>
        //             ))}
        //         </div>
        //     ))} */}
        //     <div>Greg</div>
                
        // </InfiniteScroll>
        <InfiniteScroll
            pageStart={0}
            loadMore={loadMore}
            hasMore={false}
            loader={<div className="loader" key={0}>Loading ...</div>}
        >
            <div>Greg</div>
        </InfiniteScroll>
    );
}
            
            /*
{initialEvents.map((group, index) => (
    <div key={index}>
    <DateHeader date={today} />
    <CategoryHeader sticky={false}>{group.type}</CategoryHeader>
    {group.events.map((event, index) => (
        <EventPreview key={index} event={event} />
    ))}
    </div>
))}
*/
