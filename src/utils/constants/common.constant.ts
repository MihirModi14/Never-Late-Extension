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
  SHOW_PAST_MEETINGS: 'showPastMeetings',
  SHOW_OPTIONAL_MEETINGS: 'showOptionalMeetings',
  MEETING_ACTION: 'meetingAction',
  OPEN_MEETING_BEFORE: 'openMeetingBefore',
  SHOW_NOTIFICATION_BEFORE: 'showNotificationBefore',
};

export const MESSAGE_TYPES = {
  FETCH_MEETINGS: 'fetch_meetings',
  MEETINGS_UPDATED: 'meetings_updated',
  SHOW_PAST_MEETINGS: 'show_past_meetings',
  SHOW_OPTIONAL_MEETINGS: 'show_optional_meetings',
  UPDATE_ALARM: 'update_alarm',
};

export const ALARM_NAMES = {
  FETCH_MEETINGS: 'fetch_meetings',
  MEETING_TIME: 'meeting_time',
};

export const MEETING_ACTION = {
  NEW_TAB: "NEW_TAB",
  NOTIFICATION: "NOTIFICATION",
  NOTHING: "NOTHING",
}