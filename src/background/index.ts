import { auth } from "@NeverLate/utils/services/auth.service";
import { getCalendarEventsApi } from "./calendar";
import "./alarm";

chrome.runtime.onInstalled.addListener(async () => {
  auth.checkAndProceed(getCalendarEventsApi);
});


