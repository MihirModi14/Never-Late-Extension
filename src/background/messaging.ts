import { logger } from '../helpers/logger.helper';

// Generic type for messages
export interface Message {
  type: string;
  [key: string]: any;
}

// Type for the callback in on()
export type MessageCallback = (
  message: Message,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => void;

export const messaging = {
  // Send a message to the background or other contexts
  send: async <T = unknown>(message: Message): Promise<T | undefined> => {
    return new Promise<T | undefined>((resolve, _) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          logger.error('Messaging error:', chrome.runtime.lastError.message);
          resolve(undefined);
        } else {
          resolve(response as T);
        }
      });
    });
  },

  // Listen for incoming messages
  on: (callback: MessageCallback): void => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      callback(message, sender, sendResponse);
      // Return true to indicate async sendResponse support
      return true;
    });
  },
};
