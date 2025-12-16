import { auth } from "@NeverLate/utils/services/auth.service";
import "./alarm";
import './message'
import { getCalendarEventsApi } from "./calendar";

chrome.runtime.onInstalled.addListener(async () => {
    auth.login();
    getCalendarEventsApi();
});

chrome.runtime.onStartup.addListener(async () => {
    auth.login();
    getCalendarEventsApi();
});

chrome.idle.onStateChanged.addListener((state) => {
    if (state === 'active') {
        getCalendarEventsApi();
    }
});
