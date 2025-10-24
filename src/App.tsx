import { useEffect, useState } from "react";
import "./App.css";
import type { CalenderEvent } from "./types/calender.type";

function App() {
  const [eventList, setEventList] = useState<CalenderEvent[]>([]);

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
      if (message.type === "fetched_meetings") {
        console.log(sender);
        getEventList();
        return sendResponse();
      }
    }
  );

  return (
    <div>
      {eventList.length === 0 && <p>No Events Found</p>}
      {eventList.length !== 0 && <p>Events Found</p>}
      {eventList?.map((event: CalenderEvent) => {
        return (
          <div
            key={event.id}
            style={{
              border: "1px solid black",
              margin: "10px",
              padding: "10px",
            }}
          >
            <h3>{event.summary}</h3>
          </div>
        );
      })}
    </div>
  );
}

export default App;
