import { FunctionComponent } from 'react';
import { CalendarEvent } from '../types';
import EventGroup from './EventGroup';

interface EventListProps {
  events: CalendarEvent[];
}

const EventList: FunctionComponent<EventListProps> = ({ events }: { events: CalendarEvent[]}) => {
  const pastEvents = [];
  const futureEvents = [];
  const now = new Date();
  for (const event of events) {
    if (event.endDate < now) {
      pastEvents.push(event);
    } else {
      futureEvents.push(event);
    }
  }
  const pastEventsByDay = pastEvents.reduce((groups, event) => {
    const date = event.startDate.toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(event);
    return groups;
  }, {} as Record<string, CalendarEvent[]>);

  const futureEventsByDay = futureEvents.reduce((groups, event) => {
    const date = event.startDate.toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(event);
    return groups;
  }, {} as Record<string, CalendarEvent[]>);

  return (
    <div className="space-y-8">
      {Object.keys(pastEventsByDay).length > 0 && (
        <details className="rounded-lg bg-gray-50 p-4">
          <summary className="cursor-pointer text-lg font-medium text-gray-700">
            Past Events ({Object.values(pastEventsByDay).flat().length})
          </summary>
          <div className="mt-4 space-y-8">
            {Object.entries(pastEventsByDay)
              .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
              .map(([date, dayEvents]) => (
                <EventGroup key={date} date={date} events={dayEvents} />
              ))}
          </div>
        </details>
      )}

      {Object.entries(futureEventsByDay).map(([date, dayEvents]) => (
        <EventGroup key={date} date={date} events={dayEvents} />
      ))}
    </div>
  );
};

export default EventList;