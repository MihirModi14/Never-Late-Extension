import { logger } from "../helpers/logger.helper";

export const messaging = {
  send: async (message) => {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          logger.warn("Messaging error:", chrome.runtime.lastError.message);
          reject(chrome.runtime.lastError);
        } else {
          resolve(response);
        }
      });
    });
  },

  on: (callback) => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      callback(message, sender, sendResponse);
      // Return true if you want to send a response asynchronously
      return true;
    });
  },
};
