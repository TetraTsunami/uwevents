"use client";
import { ScheduledEvent } from "../UWEvent";
import {
    faAlignLeft,
    faClock,
    faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./links.module.css";
import { useState } from "react";
import dayjs from "dayjs";

export const EventPreview = ({ event }: { event: ScheduledEvent }) => {
    const { title, subtitle, location, time, description, link, date } = event;
    const today = dayjs().format("YYYY-MM-DD") === date
    const started = today && event.time.start && event.time.start < dayjs()
    const soon = today && !started && event.time.start && event.time.start.diff(dayjs(), "hour") < 1
    const [ click, setClick ] = useState(false);
    const [ hover, setHover ] = useState(false);

    return (
        <div className="mx-auto my-2 flex flex-col gap-1 break-all rounded-md border border-neutral-700 bg-neutral-900 p-2 text-left sm:px-5 sm:py-4" onClick={() => setClick((cur) => !cur)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{"outline": click ? "1px solid #d72415" : "none"}}>
            <h3 className="sm:font-semibold md:text-xl">
                <a
                    href={link}
                    target="_blank"
                    className="hover:text-red-200 active:text-red-400 sm:underline"
                >
                    {title}
                </a>
            </h3>
            {subtitle && (
                <div className="text-sm text-white/80">{subtitle}</div>
            )}
            <div className="flex w-full flex-wrap gap-x-3 text-xs sm:text-base">
                {time && (
                    <div>
                        <FontAwesomeIcon
                            fixedWidth={true}
                            icon={faClock}
                            className="mr-2"
                        />
                        {time.toString()}
                    </div>
                )}
                {location && (
                    <div>
                        <FontAwesomeIcon
                            fixedWidth={true}
                            icon={faLocationDot}
                            className="mr-2"
                        />
                        <span
                            className={styles.inner}
                            dangerouslySetInnerHTML={{ __html: location }}
                        ></span>
                    </div>
                )}
                {description.replace("s", "") && (
                    <div>
                        <FontAwesomeIcon
                            fixedWidth={true}
                            icon={faAlignLeft}
                            className="mr-2"
                        />
                    </div>
                )}
                <div className="flex-grow" />
                {started && (
                  <div className="rounded-full bg-slate-600 px-2">
                    Started
                  </div>
                )}
                {soon && (
                  <div className="rounded-full bg-slate-800 px-2">
                    Soon
                  </div>
                )}
            </div>
            <div className="overflow-y-clip break-normal text-sm transition-all duration-500" style={{"maxHeight": (click || hover) ? "100vh" : "0"}}>
                {description
                    .split("\n")
                    .filter((el) => el != "")
                    .map((line, index) => (
                        <p key={index} className="mt-1">
                            {line}
                        </p>
                    ))}
            </div>
        </div>
    );
};
