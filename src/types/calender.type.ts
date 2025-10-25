import { calendar_v3 } from "googleapis/build/src/apis/calendar/v3";

export type CalendarEvent = calendar_v3.Schema$Event;


export type CalendarApiResponse = {
    items: CalendarEvent[];
}