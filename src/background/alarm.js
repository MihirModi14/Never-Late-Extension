import { fetchCalendarEvents } from "./calender";

chrome.alarms.create("fetchEvents", { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener((alarm) => {
  console.log("fetching meetings", new Date().getTime());
  if (alarm.name === "fetchEvents") fetchCalendarEvents();
});
