import { getAccessToken } from "./auth";

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

    const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&maxResults=2500&singleEvents=true&orderBy=startTime`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    // Save for popup or options page
    chrome.storage.local.set({ calendarEvents: data.items });

    chrome.runtime.sendMessage({ type: "fetched_meetings" }, () => {
      if (chrome.runtime.lastError) {
        console.log("popup is closed");
      } else {
        console.log("refresh done");
      }
    });
  } catch (error) {
    console.error("Error fetching calendar events:", error);
  }
}
