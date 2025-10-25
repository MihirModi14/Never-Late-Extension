import { useEffect, useState } from "react";
import "./App.css";
import type { CalendarEvent } from "./types/calender.type";
import { calenderEvent } from "./constants/calender.constant";
import { formatDate } from "./helpers/date.helper";
import { DATE_FORMAT } from "./constants/common.constant";
import { SquareArrowOutUpRight, Users } from "lucide-react";

function App() {
  const [eventList, setEventList] = useState<CalendarEvent[]>([
    calenderEvent,
    calenderEvent,
  ]);

  useEffect(() => {
    getEventList();
  }, []);

  const getEventList = () => {
    chrome.storage.local.get("calendarEvents").then((response: any) => {
      setEventList(response.calendarEvents || []);
    });
  };

  chrome.runtime.onMessage.addListener(
    (
      message: { type: string },
      sender: chrome.runtime.MessageSender,
      sendResponse: (response?: any) => void
    ) => {
      console.log("🚀 ~ App ~ sender:", sender);
      if (message.type === "fetched_meetings") {
        getEventList();
        return sendResponse();
      }
    }
  );

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
