import { getCalendarEventsApi } from "./calendar";
import "./alarm";
import './auth'

chrome.runtime.onInstalled.addListener(() => {
  getCalendarEventsApi();
});
