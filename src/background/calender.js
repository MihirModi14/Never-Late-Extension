import { getAccessToken } from "./auth";
import { storage } from "./storage";
import { messaging } from "./messaging";

export const fetchCalendarEvents = () => {
  const token = getAccessToken();
  const url = `${import.meta.env.VITE_CALENDER_URL}?${getParams()}`;

  const response = fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = response.json();

  storage.set({ calendarEvents: data.items });
  messaging.send({ type: "fetched_meetings" });
};

const getParams = () => {
  const now = new Date();
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));
  const endOfDay = new Date(now.setHours(23, 59, 59, 999));

  return new URLSearchParams({
    timeMin: startOfDay.toISOString(),
    timeMax: endOfDay.toISOString(),
    maxResults: 2500,
    singleEvents: true,
    orderBy: "startTime",
  });
};
