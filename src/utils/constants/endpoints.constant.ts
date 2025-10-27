import { HttpMethod } from "./common.constant";

const MODULE = '/calendar'
const VERSION = '/v3'

export const ENDPOINTS = {
  CALENDAR: {
    LIST: {
      method: HttpMethod.GET,
      endpoint: MODULE + VERSION + "/calendars/primary/events",
    }
  },
};
