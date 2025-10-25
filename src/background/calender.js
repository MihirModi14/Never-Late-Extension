import { getAccessToken } from "./auth";
import { storage } from "./storage";
import { messaging } from "./messaging";

export async function fetchCalendarEvents() {
  const token = await getAccessToken();
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59
  );

  const timeMin = startOfDay.toISOString();
  const timeMax = endOfDay.toISOString();

  const url = `${
    import.meta.env.VITE_CALENDER_URL
  }?timeMin=${timeMin}&timeMax=${timeMax}&maxResults=2500&singleEvents=true&orderBy=startTime`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();

  storage.set({ calendarEvents: data.items });
  messaging.send({ type: "fetched_meetings" });
}
