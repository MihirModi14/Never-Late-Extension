// alarm.helper.ts
import { logger } from "./logger.helper";

export interface AlarmOptions {
    periodInMinutes?: number;
    delayInMinutes?: number;
}

export const alarm = {
    create: (name: string, options: AlarmOptions): void => {
        chrome.alarms.get(name, (existing) => {
            if (existing) {
                logger.info(`[alarm] '${name}' already exists`);
                return;
            }
            chrome.alarms.create(name, options);
            logger.info(`[alarm] Created '${name}' with options:`, options);
        });
    },

    on: (type: string, callback: (alarm: chrome.alarms.Alarm) => void): void => {
        chrome.alarms.onAlarm.addListener((firedAlarm: chrome.alarms.Alarm) => {
            if (firedAlarm.name === type) {
                callback(firedAlarm);
            }
        });
        logger.info("[alarm] Listener attached");
    },

    remove: (name: string): void => {
        chrome.alarms.clear(name, (wasCleared) => {
            logger.info(`[alarm] Removed '${name}':`, wasCleared);
        });
    },

    removeAll: (): void => {
        chrome.alarms.clearAll(() => {
            logger.info("[alarm] Cleared all alarms");
        });
    },

    list: (): void => {
        chrome.alarms.getAll((alarms) => {
            logger.info("[alarm] Active alarms:", alarms.map((a) => a.name));
        });
    },
};
