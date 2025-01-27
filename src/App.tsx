import { FormEvent, useState } from 'react';
import ICAL from 'ical.js';
import { CalendarEvent } from './types';
import EventList from './components/EventList';
import { CalendarDays, Loader2 } from 'lucide-react';
import AutoComplete from './components/Combobox';
import PRESET_CALENDARS from './utils'

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
    } catch (_err) {
      setError('Failed to load calendar events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleUrlSubmit = (e: FormEvent) => {
    e.preventDefault();
    fetchCalendar(calendarUrl);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-4xl p-2 sm:px-4 sm:py-8">
        <header className="mb-4">
          <div className="mb-6 flex items-center">
            <CalendarDays className="mr-3 h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">iCal Viewer</h1>
          </div>
          
          <form onSubmit={handleUrlSubmit} className="flex flex-wrap gap-2">
            <AutoComplete type='url' placeholder='Enter calendar URL' data={PRESET_CALENDARS} input={[calendarUrl, setCalendarUrl]} />
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading...
                </span>
              ) : (
                'Load Calendar'
              )}
            </button>
          </form>
        </header>

        {error ? (
          <div className="rounded border-l-4 border-red-500 bg-red-50 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-lg bg-white p-6 text-center shadow-md">
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