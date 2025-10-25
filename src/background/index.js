import { fetchCalendarEvents } from "./calender";
import "./alarm";

chrome.runtime.onInstalled.addListener(() => {
  fetchCalendarEvents();
});
