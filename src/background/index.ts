import { auth } from "@NeverLate/utils/services/auth.service";
import { getCalendarEventsApi } from "./calendar";
import "./alarm";
import './message'
import { storage } from "@NeverLate/utils/services/storage.service";

chrome.runtime.onInstalled.addListener(async () => {
  await storage.clear();
  auth.checkAndProceed(() => getCalendarEventsApi({}));
});


