export type CalenderEventsResponse = {
  items: Event[];
};

export type CalenderEvent = {
  kind: string;
  etag: string;
  id: string;
  status: string;
  htmlLink: string;
  created: string;
  updated: string;
  summary: string;
  creator: {
    email: string;
    self: boolean;
  };
  organizer: {
    email: string;
    self: boolean;
  };
  start: {
    date: string;
  };
  end: {
    date: string;
  };
  recurringEventId: string;
  originalStartTime: {
    date: string;
  };
  transparency: string;
  visibility: string;
  iCalUID: string;
  sequence: number;
  reminders: {
    useDefault: boolean;
  };
  birthdayProperties: {
    type: string;
  };
  eventType: string;
};

// {
//     "kind": "calendar#event",
//     "etag": "\"3487591865064199\"",
//     "id": "19o7d836ha3b5htsidejmt7jss_20261014",
//     "status": "confirmed",
//     "htmlLink": "https://www.google.com/calendar/event?eid=MTlvN2Q4MzZoYTNiNWh0c2lkZWptdDdqc3NfMjAyNjEwMTQgbW9kaW1paGlyOTYwQG0",
//     "created": "2025-01-16T14:32:18.000Z",
//     "updated": "2025-02-11T06:37:14.609Z",
//     "summary": "Happy birthday!",
//     "creator": {
//         "email": "modimihir960@gmail.com",
//         "self": true
//     },
//     "organizer": {
//         "email": "modimihir960@gmail.com",
//         "self": true
//     },
//     "start": {
//         "date": "2026-10-14"
//     },
//     "end": {
//         "date": "2026-10-15"
//     },
//     "recurringEventId": "19o7d836ha3b5htsidejmt7jss",
//     "originalStartTime": {
//         "date": "2026-10-14"
//     },
//     "transparency": "transparent",
//     "visibility": "private",
//     "iCalUID": "19o7d836ha3b5htsidejmt7jss@google.com",
//     "sequence": 0,
//     "reminders": {
//         "useDefault": false
//     },
//     "birthdayProperties": {
//         "type": "self"
//     },
//     "eventType": "birthday"
// }
