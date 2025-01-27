export interface CalendarEvent {
  summary: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  location?: string;
}