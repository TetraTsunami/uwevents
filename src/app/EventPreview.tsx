import { ScheduledEvent } from "../UWEvent";
import { faClock, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./links.module.css";

export const EventPreview = ({ event }: { event: ScheduledEvent; }) => {
  const { title, subtitle, location, time } = event;

  return (
    <div className="grid text-left w-full mx-auto my-2 rounded-md border
        px-5 py-4 transition-colors border-gray-300 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-900 group">
      <h3 className="text-xl">{title}</h3>
      {subtitle && <div className="text-white/80 text-sm">{subtitle}</div>}
      <div className="flex flex-wrap gap-x-3">
        {time && <div><FontAwesomeIcon fixedWidth={true} icon={faClock} className="mr-2" />{time.toString()}</div>}
        {location && <div><FontAwesomeIcon fixedWidth={true} icon={faLocationDot} className="mr-2" /><span className={styles.inner}dangerouslySetInnerHTML={{__html: location}}></span></div>}
      </div>
    </div>
  );
};
