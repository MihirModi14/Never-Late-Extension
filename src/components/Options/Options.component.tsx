import { CalendarEvent } from "@NeverLate/types/calendar.type";
import {
  MEETING_ACTION,
  MESSAGE_TYPES,
  STORAGE_KEYS,
} from "@NeverLate/utils/constants/common.constant";
import { isEmptyValue } from "@NeverLate/utils/helpers/common.helper";
import { messaging } from "@NeverLate/utils/services/messaging.service";
import { storage } from "@NeverLate/utils/services/storage.service";
import { Bell, Calendar, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";

type MeetingAction = (typeof MEETING_ACTION)[keyof typeof MEETING_ACTION];

export const Options = ({
  isLoading,
  setIsLoading,
  eventList,
}: {
  isLoading: boolean;
  setIsLoading(isLoading: boolean): void;
  eventList: CalendarEvent[];
}) => {
  // State Variables
  const [showPastMeetings, setShowPastMeetings] = useState<boolean>();
  const [showOptional, setShowOptional] = useState<boolean>();

  const [meetingAction, setMeetingAction] = useState<MeetingAction | undefined>(
    undefined
  );
  const [openBefore, setOpenBefore] = useState<number>(0);
  const [notificationBefore, setNotificationBefore] = useState<number>(0);

  const [syncMeeting, setSyncMeeting] = useState<number>();

  // Hooks
  useEffect(() => {
    loadPreferencesFromStorage();
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
      type: MESSAGE_TYPES.UPDATE_ALARM,
    });
  }, [meetingAction, openBefore, notificationBefore, eventList]);

  useEffect(() => {
    if (!syncMeeting) return;

    storage.set({
      [STORAGE_KEYS.SYNC_MEETING_TIME]: syncMeeting,
    });
    messaging.send({
      type: MESSAGE_TYPES.UPDATE_SYNC_TIME,
    });
  }, [syncMeeting]);

  // Helper Methods
  const loadPreferencesFromStorage = async () => {
    const showPastMeetings = await storage.get(STORAGE_KEYS.SHOW_PAST_MEETINGS);
    const showOptional = await storage.get(STORAGE_KEYS.SHOW_OPTIONAL_MEETINGS);
    const action = await storage.get(STORAGE_KEYS.MEETING_ACTION);
    const openBefore = await storage.get(STORAGE_KEYS.OPEN_MEETING_BEFORE);
    const syncMeetingTime = await storage.get(STORAGE_KEYS.SYNC_MEETING_TIME);
    const notifyBefore = await storage.get(
      STORAGE_KEYS.SHOW_NOTIFICATION_BEFORE
    );

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
    if (typeof notifyBefore === "number") setNotificationBefore(notifyBefore);
    if (typeof syncMeetingTime === "number") setSyncMeeting(syncMeetingTime);
  };

  return (
    <section className="px-[1.4rem] py-[1.4rem] select-none">
      <div className="flex flex-col gap-[4px] border px-[1.2rem] py-[1rem] rounded-[6px]">
        <div className="mb-[6px] flex gap-[8px] items-center">
          <Calendar className="size-[1.6rem]" />
          <h3 className="text-[1.6rem]">Display Options</h3>
        </div>
        <div className="flex justify-between">
          <label htmlFor="showPast" className="flex-1">
            Show Past Meetings{" "}
          </label>
          <input
            id="showPast"
            type="checkbox"
            checked={showPastMeetings}
            onChange={() => {
              setIsLoading(true);
              setShowPastMeetings(!showPastMeetings);
            }}
          />
        </div>

        <div className="flex justify-between">
          <label htmlFor="showOptionalMeeting" className="flex-1">
            Show Optional Meetings{" "}
          </label>
          <input
            id="showOptionalMeeting"
            type="checkbox"
            checked={showOptional}
            onChange={() => {
              setIsLoading(true);
              setShowOptional(!showOptional);
            }}
          />
        </div>
      </div>
      <div className="mt-[1.6rem] flex flex-col gap-[4px] border px-[1.2rem] py-[1rem] rounded-[6px]">
        <div className="mb-[6px] flex gap-[8px] items-center">
          <Bell className="size-[1.6rem]" />
          <h3 className="text-[1.6rem]">Meeting Actions</h3>
        </div>
        <div className="flex flex-col gap-[4px]">
          <div>
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
              <div className="mt-[4px]">
                <input
                  type="number"
                  id="openBefore"
                  min={0}
                  max={20}
                  value={openBefore}
                  onChange={(e) => setOpenBefore(Number(e.target.value))}
                  className="border rounded-[4px] mr-[6px] px-[6px] py-[4px] w-[55px] text-black"
                />
                <label htmlFor="openBefore">minutes before</label>
              </div>
            )}
          </div>

          <div>
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
              <div className="mt-[4px]">
                <input
                  type="number"
                  id="notifyBefore"
                  min={0}
                  max={20}
                  value={notificationBefore}
                  onChange={(e) =>
                    setNotificationBefore(Number(e.target.value))
                  }
                  className="border rounded-[4px] mr-[6px] px-[6px] py-[4px] w-[55px] text-black"
                />
                <label htmlFor="notifyBefore">minutes before</label>
              </div>
            )}
          </div>

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
      </div>
      <div className="mt-[1.6rem] flex flex-col gap-[4px] border px-[1.2rem] py-[1rem] rounded-[6px]">
        <div className="mb-[6px] flex gap-[8px] items-center">
          <RefreshCcw className="size-[1.6rem]" />
          <h3 className="text-[1.6rem]">Sync Settings</h3>
        </div>
        <div>
          <label htmlFor="syncMeeting" className="block">
            Fetch meeting every
          </label>
          <input
            type="number"
            min={1}
            id="syncMeeting"
            value={syncMeeting}
            onChange={(e) => setSyncMeeting(Number(e.target.value))}
            className="border mt-[4px] rounded-[4px] mr-[6px] px-[6px] py-[4px] w-[55px] text-black"
          />
          <label>minutes</label>
        </div>
        <div>use the refresh button on events tab for immediate update</div>
      </div>
    </section>
  );
};
