import { getCalendarEventsApi } from "./calendar";
import { auth } from "../utils/services/auth.service";
import "./alarm";

chrome.runtime.onInstalled.addListener(async () => {
  auth.checkAndProceed(getCalendarEventsApi);
});


