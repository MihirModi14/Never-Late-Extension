import { getCalendarEventsApi } from "./calender";
import "./alarm";

chrome.runtime.onInstalled.addListener(() => {
  getCalendarEventsApi();
});
