import { useEffect, useState } from "react";
import "./App.css";
import type { CalendarEvent } from "@NeverLate/types/calendar.type";
import { EventList } from "./components/EventList/EventList.component";
import { Options } from "./components/Options/Options.component";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { DATE_FORMAT, MESSAGE_TYPES, STORAGE_KEYS } from "./utils/constants/common.constant";
import { storage } from "./utils/services/storage.service";
import { Message, messaging } from "./utils/services/messaging.service";
import { formatDate } from "./utils/helpers/date.helper";
import { Clock } from "lucide-react";

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
        <TabsList className="w-full">
          <div className="bg-[#225be4] px-[1rem] py-[1.4rem] w-full">
            <div className=" flex justify-between items-start">
              <div className="flex items-center gap-[6px]">
                <Clock className="size-[1.6rem]" />
                <h3>Never Late</h3>
              </div>
              <p className="bg-[#4a72e1] px-[1rem] py-[6px] rounded-[6px]">{formatDate(new Date(), DATE_FORMAT.MMM_DD)}</p>
            </div>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="options">Options</TabsTrigger>
          </div>
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
