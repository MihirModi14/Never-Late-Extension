import { useEffect, useState } from "react";
// import { logger } from "./helpers/logger.helper";
import "./App.css";
import type { CalendarEvent } from "./types/calendar.type";
import { formatDate } from "./helpers/date.helper";
import {
  DATE_FORMAT,
  MESSAGE_TYPES,
  STORAGE_KEYS,
} from "./constants/common.constant";
import { SquareArrowOutUpRight, Users } from "lucide-react";
import { Message, messaging } from "./helpers/messaging.helper";
import { storage } from "./helpers/storage.helper";

function App() {
  // State Variables
  const [eventList, setEventList] = useState<CalendarEvent[]>([]);

  // Hooks
  useEffect(() => {
    getEventsFromStorage();
  }, []);

  useEffect(() => {
    messaging.on(MESSAGE_TYPES.FETCHED_MEETINGS, (message: Message) => {
      setEventList(message[STORAGE_KEYS.CALENDAR_EVENTS] || []);
    });

    return () => {
      messaging.off(MESSAGE_TYPES.FETCHED_MEETINGS);
    };
  }, []);

  // Helper Methods
  const getEventsFromStorage = async () => {
    const eventList: CalendarEvent[] | null = await storage.get(
      STORAGE_KEYS.CALENDAR_EVENTS
    );
    if (eventList) setEventList(eventList || []);
  };

  // JSX
  return (
    <section className="border p-[1rem] bg-[var(--background)]">
      <div className="flex flex-col gap-[1rem]">
        {eventList?.map((event: CalendarEvent) => {
          return (
            <div
              key={event.id}
              className="flex justify-between items-start text-left text-text-primary p-[8px] rounded-[6px] bg-white"
            >
              <div>
                <h3 className="mb-[4px]">{event.summary}</h3>
                <div className="mb-[4px] flex gap-[8px]">
                  {event.start?.dateTime && (
                    <p className="text-[1.2rem]">
                      {formatDate(event.start?.dateTime, DATE_FORMAT.H_M_A)}
                    </p>
                  )}
                  {event.start?.dateTime && event.end?.dateTime && "-"}
                  {event.end?.dateTime && (
                    <p className="text-[1.2rem]">
                      {formatDate(event.end?.dateTime, DATE_FORMAT.H_M_A)}{" "}
                    </p>
                  )}
                </div>
                {event.description && (
                  <p className="text-[1.2rem] mb-[4px]">{event.description}</p>
                )}
                {event.attendees && event.attendees.length > 0 && (
                  <p className="flex items-center gap-[6px]">
                    <Users className="size-[1.2rem]" />
                    <span className="text-[1.2rem]">
                      {event.attendees?.length}
                    </span>
                  </p>
                )}
              </div>
              {event.hangoutLink && (
                <a
                  target="_blank"
                  href={event.hangoutLink}
                  className="rounded-[6px] bg-[var(--primary)] inline-block p-[5px]"
                >
                  <SquareArrowOutUpRight className="text-white size-[1.2rem]" />
                </a>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default App;
