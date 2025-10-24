import { useEffect, useState } from "react";
import "./App.css";
import type { CalendarEvent } from "./types/calender.type";
import { calenderEvent } from "./constants/calender.constant";
import { formatDate } from "./helpers/date.helper";
import { DATE_FORMAT } from "./constants/common.constant";
import { SquareArrowOutUpRight, Users } from "lucide-react";

function App() {
  const [eventList, setEventList] = useState<CalendarEvent[]>([calenderEvent]);

  useEffect(() => {
    getEventList();
  }, []);

  const getEventList = () => {
    // chrome.storage.local.get("calendarEvents").then((response: any) => {
    //   setEventList(response.calendarEvents || []);
    //   console.log("Loaded calendar events:", response.calendarEvents);
    // });
  };

  // chrome.runtime.onMessage.addListener(
  //   (
  //     message: { type: string },
  //     sender: chrome.runtime.MessageSender,
  //     sendResponse: (response?: any) => void
  //   ) => {
  //     if (message.type === "fetched_meetings") {
  //       console.log(sender);
  //       getEventList();
  //       return sendResponse();
  //     }
  //   }
  // );

  return (
    <section className="border p-[1rem] bg-[var(--background)]">
      {eventList?.map((event: CalendarEvent) => {
        return (
          <div
            key={event.id}
            className="text-left text-text-primary p-[8px] rounded-[6px] bg-white"
          >
            <h3 className="text-[1rem]">{event.summary}</h3>
            <div className="flex gap-[8px]">
              {event.start?.dateTime && (
                <p>{formatDate(event.start?.dateTime, DATE_FORMAT.H_M_A)}</p>
              )}
              -
              {event.end?.dateTime && (
                <p>{formatDate(event.end?.dateTime, DATE_FORMAT.H_M_A)} </p>
              )}
            </div>
            {event.description && <p>{event.description}</p>}
            <p className="flex gap-[6px]">
              <Users className="size-[1.2rem]" />
              <span>{event.attendees?.length}</span>
            </p>
            {event.hangoutLink && (
              <a
                target="_blank"
                href={event.hangoutLink}
                className="rounded-[6px] bg-[var(--background)] inline-block p-[4px]"
              >
                <SquareArrowOutUpRight className="size-[1.2rem]" />
              </a>
            )}
          </div>
        );
      })}
    </section>
  );
}

export default App;
