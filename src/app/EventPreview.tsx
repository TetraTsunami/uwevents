import { ScheduledEvent } from "../UWEvent";
import { faAlignLeft, faClock, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./links.module.css";

export const EventPreview = ({ event }: { event: ScheduledEvent; }) => {
  const { title, subtitle, location, time, description, link } = event;

  return (
    <div className="group mx-auto my-2 flex flex-col gap-1 break-all rounded-md border border-gray-300 bg-gray-100 p-2 text-left transition-all dark:border-neutral-700 dark:bg-neutral-900 sm:px-5 sm:py-4">
      <h3 className="sm:font-semibold md:text-xl">
        <a href={link} target="_blank" className="hover:text-red-200 active:text-red-400 sm:underline" >{title}</a></h3>
      {subtitle && <div className="text-sm text-white/80">{subtitle}</div>}
      <div className="flex flex-wrap gap-x-3 text-xs sm:text-base">
        {time && <div><FontAwesomeIcon fixedWidth={true} icon={faClock} className="mr-2" />{time.toString()}</div>}
        {location && <div><FontAwesomeIcon fixedWidth={true} icon={faLocationDot} className="mr-2" /><span className={styles.inner}dangerouslySetInnerHTML={{__html: location}}></span></div>}
        {description.replace("\s", "") && <div><FontAwesomeIcon fixedWidth={true} icon={faAlignLeft} className="mr-2" /></div>}
      </div>
      <div className="max-h-0 overflow-y-clip text-sm transition-all duration-1000 group-hover:max-h-[500vh]">
        {description.split("\n").filter((el) => (el != "")).map((line, index) => (
          <p key={index} className="mt-1">{line}</p>
        ))}
      </div>
    </div>
  );
};
