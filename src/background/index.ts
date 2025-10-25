import { getCalendarEventsApi } from "./calendar";
import "./alarm";

chrome.runtime.onInstalled.addListener(() => {
  getCalendarEventsApi();
});
