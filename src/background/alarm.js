import { fetchCalendarEvents } from "./calender";
import { logger } from "../helpers/logger.helper";

chrome.alarms.create("fetchEvents", { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener((alarm) => {
  logger.log("fetching meetings", new Date().getTime());
  if (alarm.name === "fetchEvents") fetchCalendarEvents();
});
