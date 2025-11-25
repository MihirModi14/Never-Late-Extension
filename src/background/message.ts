import { MESSAGE_TYPES } from "@NeverLate/utils/constants/common.constant";
import { messaging } from "@NeverLate/utils/services/messaging.service";
import { getCalendarEventsApi } from "./calendar";

messaging.on(MESSAGE_TYPES.UPDATE_MEETINGS, (message) => {
    const { showPastMeetings } = message;
    getCalendarEventsApi({ showPastMeetings: showPastMeetings })
})