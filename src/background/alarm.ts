import { ALARM_NAMES } from "../constants/common.constant";
import { alarm } from "../helpers/alarm.helper";
import { getCalendarEventsApi } from "./calendar";

alarm.removeAll();
alarm.create(ALARM_NAMES.FETCH_MEETINGS, { periodInMinutes: 30 });
alarm.on(ALARM_NAMES.FETCH_MEETINGS, getCalendarEventsApi);
