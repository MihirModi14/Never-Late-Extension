import { fetchCalendarEvents } from "./calender";

chrome.runtime.onInstalled.addListener(() => {
  fetchCalendarEvents();
});
