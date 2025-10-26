import { getCalendarEventsApi } from "./calendar";
import { logger } from "../helpers/logger.helper";

chrome.alarms.create("fetchEvents", { periodInMinutes: 30 });

chrome.alarms.onAlarm.addListener((alarm) => {
  logger.info("fetching meetings", new Date().getTime());
  if (alarm.name === "fetchEvents") getCalendarEventsApi();
});
