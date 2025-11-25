import { MESSAGE_TYPES } from "@NeverLate/utils/constants/common.constant";
import { messaging } from "@NeverLate/utils/services/messaging.service";
import { getCalendarEventsApi } from "./calendar";
import { CalendarEvent } from "@NeverLate/types/calendar.type";

messaging.on(MESSAGE_TYPES.SHOW_PAST_MEETINGS, (message) => {
    const { showPastMeetings } = message;
    getCalendarEventsApi({ showPastMeetings })
})

messaging.on(MESSAGE_TYPES.SHOW_OPTIONAL_MEETINGS, (message) => {
    const { showOptional, eventList } = message;

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

    messaging.send({
        type: MESSAGE_TYPES.SHOW_OPTIONAL_MEETINGS,
        eventList: newEventList,
    });

})