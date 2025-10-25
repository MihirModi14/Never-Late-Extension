import { ACCESS_TOKEN_KEY } from "../constants/storage.constant";
import { storage } from "../helpers/storage.helper";

export async function getAccessToken() {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (chrome.runtime.lastError || !token) {
        reject(chrome.runtime.lastError || new Error("No token returned"));
      } else {
        storage.set({ [ACCESS_TOKEN_KEY]: token });
        resolve(token);
      }
    });
  });
}

getAccessToken();