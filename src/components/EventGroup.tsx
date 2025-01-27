import { CalendarEvent } from "../types";
import { Calendar, Clock, MapPin } from "lucide-react";
import { formatDate, formatTime } from "../utils";
import * as he from 'he';
import DOMPurify from 'dompurify';

interface EventGroupProps {
  date: string;
  events: CalendarEvent[];
}

function percentComplete(startDate: Date, endDate: Date, now: Date) {
  const totalDuration = endDate.getTime() - startDate.getTime();
  const elapsedTime = now.getTime() - startDate.getTime();
  return Math.min(1, Math.max(0, elapsedTime / totalDuration));
}


function sanitizeHtml(html: string) {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'strong', 'i', 'em', 'br', 'p', 'ul', 'ol', 'li', 'a'],
    ALLOWED_ATTR: ['href']
  });
};
  

export default function EventGroup({ date, events }: EventGroupProps) {
  const now = new Date();
  return (
    <div className="rounded-lg bg-white p-3 shadow-md md:p-6">
      <h2 className="mb-4 flex items-center text-xl font-semibold text-gray-800">
        <Calendar className="mr-2 h-5 w-5 text-blue-600" />
        {formatDate(new Date(date))}
      </h2>
      <div className="space-y-4">
        {events.map((event, index) => (
          <div
            key={index}
            className="relative break-words rounded-r-lg pl-3 pr-1 transition-colors hover:bg-gray-50 md:py-2 md:pl-4"
          >
            <div className="absolute left-0 top-0 h-full w-1 rounded-full bg-gray-300">
              <div className="absolute left-0 right-0 top-0 rounded-full bg-blue-600" style={{height: 100 * percentComplete(event.startDate, event.endDate, now) + "%"}}/>
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              {he.decode(event.summary)}
            </h3>
            {event.description && (
              <p 
                className="mt-1 text-gray-600"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(he.decode(event.description))
                }}
              />
            )}
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                {formatTime(event.startDate, event.endDate)}
              </div>
              {event.location && (
                <div className="flex items-center">
                  <MapPin className="mr-1 h-4 w-4" />
                  {he.decode(event.location)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};