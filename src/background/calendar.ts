import { calendarApi } from '@NeverLate/apis/calendar.api';
import { storage } from '@NeverLate/utils/services/storage.service';
import { MESSAGE_TYPES, STORAGE_KEYS } from '@NeverLate/utils/constants/common.constant';
import { messaging } from '@NeverLate/utils/services/messaging.service';
import { logger } from '@NeverLate/utils/services/logger.service';
import { updateAlarm } from './message';

type CalenderParams = {
  showPastMeetings?: boolean
}

export const getCalendarEventsApi = (params: CalenderParams) => {
  calendarApi.getCalendarList(getParams(params)).then(response => {
    storage.set({ [STORAGE_KEYS.CALENDAR_EVENTS]: response.items });
    messaging.send({ type: MESSAGE_TYPES.MEETINGS_UPDATED, [STORAGE_KEYS.CALENDAR_EVENTS]: response.items });
    updateAlarm();
  }).catch(error => {
    logger.error('Error fetching calendar events:', JSON.stringify(error));
  })
};

const getParams = (params: CalenderParams): URLSearchParams => {
  const { showPastMeetings = false } = params;

  const now = new Date();
  const startOfDay = new Date(now);

  if (showPastMeetings) startOfDay.setHours(0, 0, 0, 0);

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
