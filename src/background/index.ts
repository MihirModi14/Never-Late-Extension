import { getCalendarEventsApi } from "./calendar";
import { checkLoginAndProceed } from "./auth";
import "./alarm";

chrome.runtime.onInstalled.addListener(async () => {
  checkLoginAndProceed(getCalendarEventsApi);
});


