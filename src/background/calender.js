import { getAccessToken } from "./auth";
import { logger } from "../helpers/logger.helper";

export async function fetchCalendarEvents() {
  try {
    const token = await getAccessToken();
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
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

    // Save for popup or options page
    chrome.storage.local.set({ calendarEvents: data.items });

    chrome.runtime.sendMessage({ type: "fetched_meetings" }, () => {
      if (chrome.runtime.lastError) {
        logger.log("popup is closed");
      } else {
        logger.log("latest meeting fetched");
      }
    });
  } catch (error) {
    logger.error("Error fetching calendar events:", error);
  }
}
