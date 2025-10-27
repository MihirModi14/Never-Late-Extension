import { getCalendarEventsApi } from "./calendar";
import { auth } from "../services/auth.service";
import "./alarm";

chrome.runtime.onInstalled.addListener(async () => {
  auth.checkAndProceed(getCalendarEventsApi);
});


