import { getCalendarEventsApi } from "./calendar";
import { auth } from "../helpers/auth.helper";
import "./alarm";

chrome.runtime.onInstalled.addListener(async () => {
  auth.checkAndProceed(getCalendarEventsApi);
});


