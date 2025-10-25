import { storage } from './storage';
import { messaging } from './messaging';
import { calendarApi } from '../apis/calendar.api';
import { logger } from '../helpers/logger.helper';

// Main fetch function
export const getCalendarEventsApi = async (): Promise<void> => {
  calendarApi.getCalendarList(getParams()).then(response => {
    logger.log("🚀 ~ getCalendarEventsApi ~ response:", response);
    storage.set({ calendarEvents: response.items });
    messaging.send({ type: 'fetched_meetings' });
  }).catch(error => {
    logger.error('Error fetching calendar events:', error);
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
















// const token = await getAccessToken();

// const url = `${import.meta.env.VITE_CALENDER_URL}?${getParams().toString()}`;
// const response = await fetch(url, {
//   headers: { Authorization: `Bearer ${token}` },
// });

// if (!response.ok) {
//   throw new Error(`Failed to fetch calendar events: ${response.status}`);
// }

// const data: CalendarApiResponse = await response.json();