// messaging.helper.ts
import { logger } from './logger.helper';

export interface Message {
  type: string;
  [key: string]: any;
}

export type MessageCallback = (
  message: Message,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => void;

const listeners = new Map<string, MessageCallback>();

export const messaging = {
  send: async <T = unknown>(message: Message): Promise<T | undefined> => {
    return new Promise<T | undefined>((resolve) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          logger.warn('[message]', chrome.runtime.lastError.message);
          resolve(undefined);
        } else {
          resolve(response as T);
        }
      });
    });
  },

  on: (type: string, callback: MessageCallback): void => {
    const listener = (
      message: Message,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response?: any) => void
    ) => {
      if (message.type === type) {
        callback(message, sender, sendResponse);
      }
      return true;
    };

    // Save the original callback reference for .off()
    listeners.set(type, listener);

    chrome.runtime.onMessage.addListener(listener);
  },

  off: (type: string): void => {
    const listener = listeners.get(type);
    if (listener) {
      chrome.runtime.onMessage.removeListener(listener);
      listeners.delete(type);
    }
  },
};
