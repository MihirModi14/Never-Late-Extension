// alarm.helper.ts
import { logger } from "./logger.service";

export interface AlarmOptions {
    periodInMinutes?: number;
    delayInMinutes?: number;
    when?: number; // Added: Timestamp when alarm should fire
}

const alarmListeners = new Map<string, (alarm: chrome.alarms.Alarm) => void>();
let globalListener: ((alarm: chrome.alarms.Alarm) => void) | null = null;

export const alarm = {
    create: (name: string, options: AlarmOptions): void => {
        chrome.alarms.get(name, (existing) => {
            if (existing) {
                logger.info(`[alarm] '${name}' already exists`);
                return;
            }
            chrome.alarms.create(name, options);
            logger.info(`[alarm] Created '${name}'`);
        });
    },

    on: (type: string, callback: (alarm: chrome.alarms.Alarm) => void): void => {
        // remove old listener if exists
        const old = alarmListeners.get(type);
        if (old) chrome.alarms.onAlarm.removeListener(old);

        const listener = (firedAlarm: chrome.alarms.Alarm) => {
            if (firedAlarm.name === type) callback(firedAlarm);
        };

        alarmListeners.set(type, listener);
        chrome.alarms.onAlarm.addListener(listener);

        logger.info(`[alarm] Listener attached for '${type}'`);
    },

    onAny: (callback: (alarm: chrome.alarms.Alarm) => void): void => {
        // Remove old global listener if exists
        if (globalListener) {
            chrome.alarms.onAlarm.removeListener(globalListener);
        }

        // Create new global listener
        globalListener = (firedAlarm: chrome.alarms.Alarm) => {
            callback(firedAlarm);
        };

        chrome.alarms.onAlarm.addListener(globalListener);
        logger.info(`[alarm] Global listener attached for all alarms`);
    },

    remove: (name: string): void => {
        chrome.alarms.clear(name, (wasCleared) => {
            logger.info(`[alarm] Removed '${name}':`, wasCleared);
        });
    },

    clearAll: (): Promise<boolean> => {
        return new Promise((resolve) => {
            chrome.alarms.clearAll((wasCleared) => {
                logger.info("[alarm] Cleared all alarms");
                resolve(wasCleared);
            });
        });
    },

    list: (): void => {
        chrome.alarms.getAll((alarms) => {
            logger.info("[alarm] Active alarms:", alarms.map((a) => a.name));
        });
    },
};