import { useState, useEffect } from 'preact/hooks';
import ICAL from 'ical.js';
import { CalendarEvent } from './types';
import EventList from './components/EventList';
import { CalendarDays, Loader2 } from 'lucide-react';

const PRESET_CALENDARS = [
  {
    label: 'UW-Madison Events',
    url: 'https://today.wisc.edu/events.ics'
  },
];

const WORKER_URL = 'https://cal-proxy.akamitsunami.workers.dev'; // You'll need to update this

function App() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calendarUrl, setCalendarUrl] = useState('');

  const fetchCalendar = async (url: string) => {
    if (!url) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${WORKER_URL}?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch calendar');
      }
      
      const data = await response.text();
      const jcalData = ICAL.parse(data);
      const comp = new ICAL.Component(jcalData);
      const vevents = comp.getAllSubcomponents('vevent');
      
      const parsedEvents = vevents.map(vevent => {
        const event = new ICAL.Event(vevent);
        return {
          summary: event.summary,
          description: event.description,
          startDate: event.startDate.toJSDate(),
          endDate: event.endDate.toJSDate(),
          location: event.location
        };
      });

      parsedEvents.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
      setEvents(parsedEvents);
    } catch (err) {
      setError('Failed to load calendar events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleUrlSubmit = (e: Event) => {
    e.preventDefault();
    fetchCalendar(calendarUrl);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center mb-6">
            <CalendarDays className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Calendar Events</h1>
          </div>
          
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="url"
                value={calendarUrl}
                onChange={(e) => setCalendarUrl((e.target as HTMLInputElement).value)}
                placeholder="Enter calendar URL..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-x-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 divide-y divide-gray-100">
                {PRESET_CALENDARS.map((cal) => (
                  <button
                    key={cal.url}
                    type="button"
                    onClick={() => {
                      setCalendarUrl(cal.url);
                      fetchCalendar(cal.url);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                  >
                    {cal.label}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </span>
              ) : (
                'Load Calendar'
              )}
            </button>
          </form>
        </header>

        {error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">
              {loading ? 'Loading calendar events...' : 'No events found. Please select or enter a calendar URL.'}
            </p>
          </div>
        ) : (
          <EventList events={events} />
        )}
      </div>
    </div>
  );
}

export default App;