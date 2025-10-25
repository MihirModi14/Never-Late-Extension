import { logger } from "../helpers/logger.helper";

export const storage = {
  get: async (key) => {
    return new Promise((resolve) => {
      chrome.storage.local.get(key, (result) => {
        if (chrome.runtime.lastError) {
          logger.error("Storage get error:", chrome.runtime.lastError);
          resolve(null);
        } else {
          resolve(result[key]);
        }
      });
    });
  },

  set: async (obj) => {
    return new Promise((resolve) => {
      chrome.storage.local.set(obj, () => {
        if (chrome.runtime.lastError) {
          logger.error("Storage set error:", chrome.runtime.lastError);
        }
        resolve();
      });
    });
  },

  remove: async (key) => {
    return new Promise((resolve) => {
      chrome.storage.local.remove(key, () => {
        if (chrome.runtime.lastError) {
          logger.error("Storage remove error:", chrome.runtime.lastError);
        }
        resolve();
      });
    });
  },

  clear: async () => {
    return new Promise((resolve) => {
      chrome.storage.local.clear(() => {
        if (chrome.runtime.lastError) {
          logger.error("Storage clear error:", chrome.runtime.lastError);
        }
        resolve();
      });
    });
  },
};
