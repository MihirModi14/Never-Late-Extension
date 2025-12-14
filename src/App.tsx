import { useEffect, useState } from "react";
import "./App.css";
import type { CalendarEvent } from "@NeverLate/types/calendar.type";
import { EventList } from "./components/EventList/EventList.component";
import { Options } from "./components/Options/Options.component";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { MESSAGE_TYPES, STORAGE_KEYS } from "./utils/constants/common.constant";
import { storage } from "./utils/services/storage.service";
import { Message, messaging } from "./utils/services/messaging.service";
import { logger } from "./utils/services/logger.service";

function App() {
  // State Variables
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [eventList, setEventList] = useState<CalendarEvent[]>([]);

  // Hooks
  useEffect(() => {
    getEventsFromStorage();
  }, []);

  const getEventsFromStorage = async () => {
    const eventList: CalendarEvent[] | null = await storage.get(
      STORAGE_KEYS.CALENDAR_EVENTS
    );
    logger.log("event list", eventList?.length)

    if (eventList) {
      setEventList(eventList || []);
    }
  };

  useEffect(() => {
    messaging.removeAll();
    messaging.on(MESSAGE_TYPES.MEETINGS_UPDATED, (message: Message) => {
      const eventList = message[STORAGE_KEYS.CALENDAR_EVENTS] || [];
      setIsLoading(false);
      setEventList(eventList);
    });

    return () => {
      messaging.removeAll();
    };
  }, []);


  // JSX
  return (
    <section>
      <Tabs defaultValue="events">
        <TabsList>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="options">Options</TabsTrigger>
        </TabsList>
        <TabsContent value="events">
          <EventList isLoading={isLoading} eventList={eventList} />
        </TabsContent>
        <TabsContent value="options">
          <Options isLoading={isLoading} setIsLoading={setIsLoading} eventList={eventList} />
        </TabsContent>
      </Tabs>
    </section>
  );
}

export default App;
