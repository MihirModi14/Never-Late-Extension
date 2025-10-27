import { ALARM_NAMES } from "../utils/constants/common.constant";
import { alarm } from "../utils/services/alarm.service";
import { getCalendarEventsApi } from "./calendar";

alarm.removeAll();
alarm.create(ALARM_NAMES.FETCH_MEETINGS, { periodInMinutes: 30 });
alarm.on(ALARM_NAMES.FETCH_MEETINGS, getCalendarEventsApi);
