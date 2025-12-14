import { CalendarEvent } from "@NeverLate/types/calendar.type"
import { DATE_FORMAT } from "@NeverLate/utils/constants/common.constant";
import { formatDate } from "@NeverLate/utils/helpers/date.helper";
import { SquareArrowOutUpRight, Users } from "lucide-react";

export const EventList = ({ isLoading, eventList }: { eventList: CalendarEvent[], isLoading: boolean }) => {
    return <>
        {isLoading && <p>Loading...</p>}
        <div className="flex flex-col gap-[1rem]">
            {eventList?.map((event: CalendarEvent) => {
                return (
                    <div
                        key={event.id}
                        className="flex justify-between items-start p-[8px] rounded-[6px]"
                    >
                        <div className="text-left">
                            <h3>{event.summary}</h3>
                            <div className="flex gap-[8px]">
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
                            {event.description && <p dangerouslySetInnerHTML={{ __html: event.description }}></p>}
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
                            <a target="_blank" href={event.hangoutLink}>
                                <SquareArrowOutUpRight className="size-[1.4rem]" />
                            </a>
                        )}
                    </div>
                );
            })}
        </div></>
}