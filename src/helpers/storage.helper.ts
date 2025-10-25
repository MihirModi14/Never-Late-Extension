import { logger } from '../helpers/logger.helper';

type StorageKey = string | string[];
type StorageObject = Record<string, unknown>;

export const storage = {
  get: async <T = unknown>(key: string): Promise<T | null> => {
    return new Promise((resolve) => {
      chrome.storage.local.get(key, (result) => {
        if (chrome.runtime.lastError) {
          logger.error('Storage get error:', chrome.runtime.lastError);
          resolve(null);
        } else {
          resolve(result[key] as T);
        }
      });
    });
  },

  set: async (obj: StorageObject): Promise<void> => {
    return new Promise((resolve) => {
      chrome.storage.local.set(obj, () => {
        if (chrome.runtime.lastError) {
          logger.error('Storage set error:', chrome.runtime.lastError);
        }
        resolve();
      });
    });
  },

  remove: async (key: StorageKey): Promise<void> => {
    return new Promise((resolve) => {
      chrome.storage.local.remove(key, () => {
        if (chrome.runtime.lastError) {
          logger.error('Storage remove error:', chrome.runtime.lastError);
        }
        resolve();
      });
    });
  },

  clear: async (): Promise<void> => {
    return new Promise((resolve) => {
      chrome.storage.local.clear(() => {
        if (chrome.runtime.lastError) {
          logger.error('Storage clear error:', chrome.runtime.lastError);
        }
        resolve();
      });
    });
  },
};
