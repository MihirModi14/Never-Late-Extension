import { getAccessToken } from './auth';
import { storage } from './storage';
import { messaging } from './messaging';

export interface CalendarEvent {
  id: string;
  summary?: string;
  description?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  [key: string]: unknown;
}

interface CalendarApiResponse {
  items: CalendarEvent[];
  nextPageToken?: string;
  [key: string]: unknown;
}

// Main fetch function
export const fetchCalendarEvents = async (): Promise<void> => {
  try {
    const token = await getAccessToken();
    if (!token) {
      console.warn('No access token found.');
      return;
    }

    const url = `${import.meta.env.VITE_CALENDER_URL}?${getParams().toString()}`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch calendar events: ${response.status}`);
    }

    const data: CalendarApiResponse = await response.json();

    await storage.set({ calendarEvents: data.items });
    await messaging.send({ type: 'fetched_meetings' });
  } catch (error) {
    console.error('Error fetching calendar events:', error);
  }
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
