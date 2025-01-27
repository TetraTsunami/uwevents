export default [
  {
    label: 'UW-Madison Events',
    value: 'https://today.wisc.edu/events.ics'
  },
  {
    label: 'Splatoon 3 Splatfest',
    value: 'https://tsuni.dev/splatcal.ics'
  },
];


export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatTime = (startDate: Date, endDate: Date): string => {
  const isAllDay = startDate.getHours() === 0 &&
    startDate.getMinutes() === 0 &&
    endDate.getHours() === 0 &&
    endDate.getMinutes() === 0 &&
    endDate.getTime() - startDate.getTime() === 24 * 60 * 60 * 1000;

  if (isAllDay) {
    return 'All day';
  }

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