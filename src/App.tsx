import { useState } from "react";
import "./App.css";
import type { CalendarEvent } from "@NeverLate/types/calendar.type";
import { EventList } from "./components/EventList/EventList.component";
import { Options } from "./components/Options/Options.component";

function App() {
  // State Variables
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [eventList, setEventList] = useState<CalendarEvent[]>([]);

  // JSX
  return (
    <section>
      <Options isLoading={isLoading} setIsLoading={setIsLoading} eventList={eventList} setEventList={setEventList} />
      <EventList isLoading={isLoading} eventList={eventList} />
    </section>
  );
}

export default App;
