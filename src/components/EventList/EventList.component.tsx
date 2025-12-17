import { CalendarEvent } from "@NeverLate/types/calendar.type"
import { DATE_FORMAT, MESSAGE_TYPES } from "@NeverLate/utils/constants/common.constant";
import { formatDate } from "@NeverLate/utils/helpers/date.helper";
import { Clock, RefreshCcw, SquareArrowOutUpRight, Users } from "lucide-react";
import { messaging } from "@NeverLate/utils/services/messaging.service";

export const EventList = ({ isLoading, setIsLoading, eventList }: { eventList: CalendarEvent[], isLoading: boolean, setIsLoading: (isLoading: boolean) => void }) => {
    // Event Handlers
    const onClickRefresh = () => {
        setIsLoading(true);
        messaging.send({ type: MESSAGE_TYPES.FETCH_MEETINGS });
    }

    return (
        <section>
            <div className="border-b border-[#e5e7eb] p-[1.2rem] flex justify-between bg-[white]">
                <p>Today's Scheadule</p>
                <a onClick={onClickRefresh} className="flex items-center gap-[6px] cursor-pointer">
                    <RefreshCcw className="text-[#225be4] size-[1.4rem]" />
                    <span className="text-[#225be4]">Refresh</span>
                </a>
            </div>
            <div className="p-[1.2rem] h-[42rem] overflow-auto">
                {isLoading && <p className="mb-[1rem]">Loading...</p>}
                {!isLoading && eventList?.length === 0 && <p className="text-center text-[1.6rem] mb-[1rem]">No events found!!</p>}
                {!isLoading && <div className="flex flex-col gap-[1rem]">
                    {eventList?.map((event: CalendarEvent) => {
                        return (
                            <div
                                key={event.id}
                                className="border bg-[white] px-[1.2rem] py-[1rem] rounded-[6px]"
                            >
                                <div className="flex mb-[6px] items-center justify-between gap-[8px]">
                                    <h3 className="text-[1.6rem]">{event.summary}</h3>
                                    {event.hangoutLink && (
                                        <a target="_blank" href={event.hangoutLink}>
                                            <SquareArrowOutUpRight className="size-[1.6rem]" />
                                        </a>
                                    )}
                                </div>
                                <div className="flex mb-[6px] text-[1.6rem] items-center gap-[8px]">
                                    <Clock className="size-[1.4rem]" />
                                    {event.start?.dateTime && (
                                        <span>{formatDate(event.start?.dateTime, DATE_FORMAT.H_M_A)}</span>
                                    )}
                                    {event.start?.dateTime && event.end?.dateTime && "-"}
                                    {event.end?.dateTime && (
                                        <span>{formatDate(event.end?.dateTime, DATE_FORMAT.H_M_A)}</span>
                                    )}
                                </div>
                                {event.description && <p className="mb-[6px] text-[1.4rem] line-clamp-3 leading-5" dangerouslySetInnerHTML={{ __html: event.description }}></p>}
                                {event.attendees && event.attendees.length > 0 && (
                                    <p className="flex items-center gap-[8px]">
                                        <Users className="size-[1.4rem]" />
                                        <span className="text-[1.4rem]">
                                            {event.attendees?.length}
                                        </span>
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>}
            </div>
        </section>
    )
}