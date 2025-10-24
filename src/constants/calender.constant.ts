import type { CalendarEvent } from "../types/calender.type";

export const calenderEvent: CalendarEvent = {
  attendees: [
    {
      email: "mala.ruparel@smartsensesolutions.com",
      responseStatus: "needsAction",
    },
    {
      email: "sagar.chavda@smartsensesolutions.com",
      responseStatus: "needsAction",
    },
    {
      email: "terrence.fernandes@smartsensesolutions.com",
      organizer: true,
      responseStatus: "accepted",
    },
    {
      email: "divy.katira@smartsensesolutions.com",
      responseStatus: "accepted",
    },
    {
      email: "hasmukh.baldaniya@smartsensesolutions.com",
      responseStatus: "accepted",
    },
    {
      email: "ghanshyam.chauhan@smartsensesolutions.com",
      responseStatus: "needsAction",
    },
    {
      email: "akash.nara@smartsensesolutions.com",
      responseStatus: "needsAction",
    },
    {
      email: "sohil.moradiya@smartsensesolutions.com",
      responseStatus: "needsAction",
    },
    {
      email: "krunal.goswami@smartsensesolutions.com",
      responseStatus: "needsAction",
    },
    {
      email: "mihir.modi@smartsensesolutions.com",
      responseStatus: "accepted",
      self: true,
    },
  ],
  created: "2024-07-23T03:22:31.000Z",
  creator: {
    email: "terrence.fernandes@smartsensesolutions.com",
  },
  end: {
    dateTime: "2025-10-24T12:30:00+05:30",
    timeZone: "Asia/Kolkata",
  },
  etag: '"3517051222436894"',
  eventType: "default",
  htmlLink:
    "https://www.google.com/calendar/event?eid=NXU0djJqY2gycTIyOGRuNWE3NjZvM2UycWlfMjAyNTEwMjRUMDYwMDAwWiBtaWhpci5tb2RpQHNtYXJ0c2Vuc2Vzb2x1dGlvbnMuY29t",
  iCalUID: "5u4v2jch2q228dn5a766o3e2qi_R20240809T060000@google.com",
  id: "5u4v2jch2q228dn5a766o3e2qi_20251024T060000Z",
  kind: "calendar#event",
  organizer: {
    email: "terrence.fernandes@smartsensesolutions.com",
  },
  originalStartTime: {
    dateTime: "2025-10-24T11:30:00+05:30",
    timeZone: "Asia/Kolkata",
  },
  recurringEventId: "5u4v2jch2q228dn5a766o3e2qi_R20240809T060000",
  reminders: {
    useDefault: true,
  },
  sequence: 0,
  start: {
    dateTime: "2025-10-24T11:30:00+05:30",
    timeZone: "Asia/Kolkata",
  },
  status: "confirmed",
  summary: "SS-3 Training Session",
  updated: "2025-09-22T07:20:11.218Z",
  hangoutLink: "https://meet.google.com/jdg-nzgt-kyc",
};
