import { messaging } from '../helpers/messaging.helper';
import { calendarApi } from '../apis/calendar.api';
import { storage } from '../helpers/storage.helper';
import { logger } from '../helpers/logger.helper';

// Main fetch function
export const getCalendarEventsApi = () => {
  calendarApi.getCalendarList(getParams()).then(response => {
    storage.set({ calendarEvents: response.items });
    messaging.send({ type: 'fetched_meetings' });
  }).catch(error => {
    logger.error('Error fetching calendar events:', JSON.stringify(error));
  })
};

const getParams = (): URLSearchParams => {
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  return new URLSearchParams({
    timeMin: startOfDay.toISOString(),
    timeMax: endOfDay.toISOString(),
    maxResults: '2500',
    singleEvents: 'true',
    orderBy: 'startTime',
  });
};
