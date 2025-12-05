import { ALARM_NAMES, STORAGE_KEYS } from "@NeverLate/utils/constants/common.constant";
import { alarm } from "@NeverLate/utils/services/alarm.service";
import { getCalendarEventsApi } from "./calendar";
import type { CalendarEvent } from "@NeverLate/types/calendar.type";
import { storage } from "@NeverLate/utils/services/storage.service";
import { logger } from "@NeverLate/utils/services/logger.service";

alarm.clearAll();
alarm.on(ALARM_NAMES.FETCH_MEETINGS, () => {
    getCalendarEventsApi({})
});

// Listen to all meeting alarms with a pattern
alarm.onAny(async (alarmInfo) => {
    // Check if this is a meeting alarm
    if (!alarmInfo.name?.startsWith(ALARM_NAMES.MEETING_TIME)) return;

    const events = await storage.get<CalendarEvent[]>(STORAGE_KEYS.CALENDAR_EVENTS);
    const meetingAction = await storage.get(STORAGE_KEYS.MEETING_ACTION);


    if (!events || events.length === 0) {
        logger.warn('[alarm] No calendar events found in storage');
        return;
    }

    // Extract index from alarm name (e.g., "MEETING_TIME_0" -> 0)
    const alarmIndex = parseInt(alarmInfo.name.split('_').pop() || '0');
    const meeting = events[alarmIndex];

    if (!meeting) {
        logger.warn(`[alarm] Meeting at index ${alarmIndex} not found`);
        return;
    }

    // Handle the meeting based on meetingAction
    if (meetingAction === "NEW_TAB" && meeting.hangoutLink) {
        chrome.tabs.create(
            { url: meeting.hangoutLink, active: true }
        );
    } else if (meetingAction === "NOTIFICATION") {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon.png',
            title: 'Meeting Time!',
            message: meeting.summary || 'Your meeting is starting'
        });
    }

    // Remove only this specific alarm after it fires
    alarm.remove(alarmInfo.name);
});