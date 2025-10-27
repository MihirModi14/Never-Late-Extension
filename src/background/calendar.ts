import { calendarApi } from '../apis/calendar.api';
import { storage } from '../utils/services/storage.service';
import { MESSAGE_TYPES, STORAGE_KEYS } from '../utils/constants/common.constant';
import { messaging } from '../utils/services/messaging.service';
import { logger } from '../utils/services/logger.service';

export const getCalendarEventsApi = () => {
  calendarApi.getCalendarList(getParams()).then(response => {
    storage.set({ [STORAGE_KEYS.CALENDAR_EVENTS]: response.items });
    messaging.send({ type: MESSAGE_TYPES.FETCH_MEETINGS, [STORAGE_KEYS.CALENDAR_EVENTS]: response.items });
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
