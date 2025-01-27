import { FunctionComponent } from 'preact';
import { CalendarEvent } from '../types';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface EventListProps {
  events: CalendarEvent[];
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

const formatTime = (startDate: Date, endDate: Date): string => {
  // Check if it's an all-day event (starts at midnight and ends at midnight)
  const isAllDay = startDate.getHours() === 0 && 
                  startDate.getMinutes() === 0 && 
                  endDate.getHours() === 0 && 
                  endDate.getMinutes() === 0 &&
                  endDate.getTime() - startDate.getTime() === 24 * 60 * 60 * 1000;

  if (isAllDay) {
    return 'All day';
  }

  // Check if event spans multiple days
  const startDay = startDate.toDateString();
  const endDay = endDate.toDateString();

  if (startDay !== endDay) {
    return `${startDate.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    })} - ${endDate.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    })}`;
  }

  // Same day event - show times
  return `${startDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).toLowerCase()} - ${endDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).toLowerCase()}`;
};

const EventList: FunctionComponent<EventListProps> = ({ events }) => {
  const groupedEvents = events.reduce((groups, event) => {
    const date = event.startDate.toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(event);
    return groups;
  }, {} as Record<string, CalendarEvent[]>);

  return (
    <div className="space-y-8">
      {Object.entries(groupedEvents).map(([date, dayEvents]) => (
        <div key={date} className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-600" />
            {formatDate(new Date(date))}
          </h2>
          <div className="space-y-4">
            {dayEvents.map((event, index) => (
              <div
                key={index}
                className="border-l-4 border-blue-500 pl-4 py-2 hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-medium text-lg text-gray-900">{event.summary}</h3>
                {event.description && (
                  <p className="text-gray-600 mt-1">{event.description}</p>
                )}
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatTime(event.startDate, event.endDate)}
                  </div>
                  {event.location && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {event.location}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventList;