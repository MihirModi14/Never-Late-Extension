import { ALARM_NAMES, MEETING_ACTION, MESSAGE_TYPES, STORAGE_KEYS } from "@NeverLate/utils/constants/common.constant";
import { messaging } from "@NeverLate/utils/services/messaging.service";
import { getCalendarEventsApi } from "./calendar";
import { CalendarEvent } from "@NeverLate/types/calendar.type";
import { storage } from "@NeverLate/utils/services/storage.service";
import { isEmptyValue } from "@NeverLate/utils/helpers/common.helper";
import { alarm } from "@NeverLate/utils/services/alarm.service";

messaging.removeAll();
messaging.on(MESSAGE_TYPES.SHOW_PAST_MEETINGS, async () => {
    const showPastMeetings: boolean | null = await storage.get(STORAGE_KEYS.SHOW_PAST_MEETINGS);

    if (isEmptyValue(showPastMeetings)) return;
    getCalendarEventsApi({ showPastMeetings: Boolean(showPastMeetings) })
})

messaging.on(MESSAGE_TYPES.SHOW_OPTIONAL_MEETINGS, async () => {
    const showOptional: boolean | null = await storage.get(STORAGE_KEYS.SHOW_OPTIONAL_MEETINGS);
    const eventList: CalendarEvent[] | null = await storage.get(STORAGE_KEYS.CALENDAR_EVENTS);

    if (isEmptyValue(showOptional) || !eventList) return;

    let newEventList = []
    if (showOptional) {
        newEventList = eventList;
    } else {
        newEventList = eventList.filter((event: CalendarEvent) => {
            const me = event.attendees?.find((a) => a.self);
            if (!me) return true;
            return me?.optional !== true;
        });
    }

    storage.set({ [STORAGE_KEYS.CALENDAR_EVENTS]: newEventList });
    messaging.send({
        type: MESSAGE_TYPES.MEETINGS_UPDATED,
        [STORAGE_KEYS.CALENDAR_EVENTS]: newEventList
    });
})

messaging.on(MESSAGE_TYPES.UPDATE_ALARM, async () => {
    const syncMeetingTime: number | null = await storage.get(STORAGE_KEYS.SYNC_MEETING_TIME);
    const eventList: CalendarEvent[] | null = await storage.get(STORAGE_KEYS.CALENDAR_EVENTS);

    await alarm.clearAll().then(() => {
        alarm.create(ALARM_NAMES.FETCH_MEETINGS, { periodInMinutes: syncMeetingTime || 60 });
    });

    if (!eventList?.length) return;

    const notifyBefore: number = await getNotifiyTimeBefore();

    for (let i = 0; i < eventList.length; i++) {
        const eventTime = eventList[i].start?.dateTime;
        if (!eventTime) continue;
        if (eventList[i].attendees) {
            const me = eventList[i].attendees?.find((a) => a.self);
            if (me?.optional) continue;
        }

        const target = new Date(eventTime).getTime() - (notifyBefore * 60 * 1000);
        const diffMs = target - Date.now();

        if (diffMs > 0) {
            const alarmName = `${ALARM_NAMES.MEETING_TIME}_${i}`;
            alarm.create(alarmName, { when: target });
        }
    }
});


const getNotifiyTimeBefore = async () => {
    const meetingAction: string | null = await storage.get(STORAGE_KEYS.MEETING_ACTION);
    if (isEmptyValue(meetingAction)) return 0;

    switch (meetingAction) {
        case MEETING_ACTION.NEW_TAB:
            const openBefore: number | null = await storage.get(STORAGE_KEYS.OPEN_MEETING_BEFORE);
            if (isEmptyValue(openBefore)) return 0;
            return openBefore || 0;

        case MEETING_ACTION.NOTIFICATION:
            const notifyBefore: number | null = await storage.get(STORAGE_KEYS.OPEN_MEETING_BEFORE);
            if (isEmptyValue(notifyBefore)) return 0;
            return notifyBefore || 0;

        default:
            return 0;
    }
}
