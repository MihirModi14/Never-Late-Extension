chrome.alarms.create("fetchEvents", { periodInMinutes: 15 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "fetchEvents") fetchCalendarEvents();
});
