export enum HttpMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}

export const HTTP_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
};


export const DATE_FORMAT = {
  H_M_A: "h:mm a",
  YYYY_MM_DD_H_M: "yyyy-MM-dd HH:mm",
};

export const STORAGE_KEYS = {
  CALENDAR_EVENTS: 'calendarEvents',
};

export const MESSAGE_TYPES = {
  FETCHED_MEETINGS: 'fetched_meetings',
};

export const ALARM_NAMES = {
  FETCHED_MEETINGS: 'fetched_meetings',
};
