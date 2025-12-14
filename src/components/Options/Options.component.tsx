import { CalendarEvent } from "@NeverLate/types/calendar.type";
import { MEETING_ACTION, MESSAGE_TYPES, STORAGE_KEYS } from "@NeverLate/utils/constants/common.constant";
import { isEmptyValue } from "@NeverLate/utils/helpers/common.helper";
import { Message, messaging } from "@NeverLate/utils/services/messaging.service";
import { storage } from "@NeverLate/utils/services/storage.service";
import { useEffect, useState } from "react";

type MeetingAction = (typeof MEETING_ACTION)[keyof typeof MEETING_ACTION];

export const Options = ({ isLoading, setIsLoading, eventList, setEventList }: { isLoading: boolean, setIsLoading: (isLoading: boolean) => void, eventList: CalendarEvent[], setEventList(eventList: CalendarEvent[]): void }) => {
    const [showPastMeetings, setShowPastMeetings] = useState<boolean>();
    const [showOptional, setShowOptional] = useState<boolean>();

    const [meetingAction, setMeetingAction] = useState<
        MeetingAction | undefined
    >(undefined);
    const [openBefore, setOpenBefore] = useState<number>(0);
    const [notificationBefore, setNotificationBefore] =
        useState<number>(0);
    const [syncMeeting, setSyncMeeting] = useState<number>();

    // Hooks
    useEffect(() => {
        loadPreferencesFromStorage();
        getEventsFromStorage();
    }, []);

    useEffect(() => {
        if (!isLoading) return;
        if (isEmptyValue(showPastMeetings)) return;

        storage.set({ [STORAGE_KEYS.SHOW_PAST_MEETINGS]: showPastMeetings });
        messaging.send({
            type: MESSAGE_TYPES.SHOW_PAST_MEETINGS,
        });
    }, [showPastMeetings]);

    useEffect(() => {
        if (!isLoading) return;
        if (isEmptyValue(showOptional)) return;

        storage.set({ [STORAGE_KEYS.SHOW_OPTIONAL_MEETINGS]: showOptional });
        messaging.send({
            type: MESSAGE_TYPES.SHOW_OPTIONAL_MEETINGS,
        });
    }, [showOptional]);

    useEffect(() => {
        if (!meetingAction) return;

        storage.set({
            [STORAGE_KEYS.MEETING_ACTION]: meetingAction,
            [STORAGE_KEYS.OPEN_MEETING_BEFORE]: openBefore,
            [STORAGE_KEYS.SHOW_NOTIFICATION_BEFORE]: notificationBefore,
        });
        messaging.send({
            type: MESSAGE_TYPES.UPDATE_ALARM
        });
    }, [
        meetingAction,
        openBefore,
        notificationBefore,
        eventList
    ]);

    useEffect(() => {
        if (!syncMeeting) return;

        storage.set({
            [STORAGE_KEYS.SYNC_MEETING_TIME]: syncMeeting,
        });
        messaging.send({
            type: MESSAGE_TYPES.UPDATE_SYNC_TIME
        });
    }, [
        syncMeeting
    ]);

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

    // Helper Methods
    const loadPreferencesFromStorage = async () => {
        const showPastMeetings = await storage.get(STORAGE_KEYS.SHOW_PAST_MEETINGS);
        const showOptional = await storage.get(STORAGE_KEYS.SHOW_OPTIONAL_MEETINGS);
        const action = await storage.get(STORAGE_KEYS.MEETING_ACTION);
        const openBefore = await storage.get(STORAGE_KEYS.OPEN_MEETING_BEFORE);
        const syncMeetingTime = await storage.get(STORAGE_KEYS.SYNC_MEETING_TIME);
        const notifyBefore = await storage.get(STORAGE_KEYS.SHOW_NOTIFICATION_BEFORE);

        setShowPastMeetings(showPastMeetings ? Boolean(showPastMeetings) : false);
        setShowOptional(showOptional ? Boolean(showOptional) : true);

        if (
            action === MEETING_ACTION.NEW_TAB ||
            action === MEETING_ACTION.NOTIFICATION ||
            action === MEETING_ACTION.NOTHING
        ) {
            setMeetingAction(action);
        } else {
            setMeetingAction(MEETING_ACTION.NEW_TAB);
        }
        if (typeof openBefore === "number") setOpenBefore(openBefore);
        if (typeof notifyBefore === "number")
            setNotificationBefore(notifyBefore);
        if (typeof syncMeetingTime === "number")
            setSyncMeeting(syncMeetingTime);
    };

    const getEventsFromStorage = async () => {
        const eventList: CalendarEvent[] | null = await storage.get(
            STORAGE_KEYS.CALENDAR_EVENTS
        );

        if (eventList) {
            setEventList(eventList || []);
        }
    };

    return <>
        <div>
            <label htmlFor="showPast">Show Past Meetings </label>
            <input
                type="checkbox"
                checked={showPastMeetings}
                onChange={() => {
                    setIsLoading(true);
                    setShowPastMeetings(!showPastMeetings);
                }}
            />
        </div>

        <div>
            <label htmlFor="showOptionalMeeting">Show Optional Meetings </label>
            <input
                type="checkbox"
                checked={showOptional}
                onChange={() => {
                    setIsLoading(true);
                    setShowOptional(!showOptional);
                }}
            />
        </div>

        <div className="flex flex-col gap-[0.5rem] mt-[1rem]">
            <h3>Meeting Actions</h3>
            <div className="flex items-center gap-[0.5rem]">
                <input
                    type="radio"
                    id="action-new-tab"
                    name="meetingAction"
                    value={MEETING_ACTION.NEW_TAB}
                    checked={meetingAction === MEETING_ACTION.NEW_TAB}
                    onChange={() => setMeetingAction(MEETING_ACTION.NEW_TAB)}
                />
                <label htmlFor="action-new-tab">Open Meeting Link</label>
            </div>

            {meetingAction === MEETING_ACTION.NEW_TAB && (
                <div className="ml-[1.5rem]">
                    <label htmlFor="openBefore">Open before (minutes): </label>
                    <input
                        type="number"
                        id="openBefore"
                        min={0}
                        max={20}
                        value={openBefore}
                        onChange={(e) => setOpenBefore(Number(e.target.value))}
                        className="border rounded p-[2px] w-[50px] text-black"
                    />
                </div>
            )}

            <div className="flex items-center gap-[0.5rem]">
                <input
                    type="radio"
                    id="action-notification"
                    name="meetingAction"
                    value={MEETING_ACTION.NOTIFICATION}
                    checked={meetingAction === MEETING_ACTION.NOTIFICATION}
                    onChange={() => setMeetingAction(MEETING_ACTION.NOTIFICATION)}
                />
                <label htmlFor="action-notification">Show Notification</label>
            </div>

            {meetingAction === MEETING_ACTION.NOTIFICATION && (
                <div className="ml-[1.5rem]">
                    <label htmlFor="notifyBefore">Notify before (minutes): </label>
                    <input
                        type="number"
                        id="notifyBefore"
                        min={0}
                        max={20}
                        value={notificationBefore}
                        onChange={(e) =>
                            setNotificationBefore(Number(e.target.value))
                        }
                        className="border rounded p-[2px] w-[50px] text-black"
                    />
                </div>
            )}

            <div className="flex items-center gap-[0.5rem]">
                <input
                    type="radio"
                    id="action-nothing"
                    name="meetingAction"
                    value={MEETING_ACTION.NOTHING}
                    checked={meetingAction === MEETING_ACTION.NOTHING}
                    onChange={() => setMeetingAction(MEETING_ACTION.NOTHING)}
                />
                <label htmlFor="action-nothing">Do Nothing</label>
            </div>
        </div>

        <div className="flex flex-col gap-[0.5rem] mt-[1rem]">
            <h3>Sync</h3>
            <div className="ml-[1.5rem]">
                <label htmlFor="syncMeeting">Fetch meeting every: </label>
                <input
                    type="number"
                    min={1}
                    id="syncMeeting"
                    value={syncMeeting}
                    onChange={(e) => setSyncMeeting(Number(e.target.value))}
                    className="border rounded p-[2px] w-[50px] text-black"
                />
            </div>
        </div></>
}