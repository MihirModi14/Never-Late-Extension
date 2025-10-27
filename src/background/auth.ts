import { ACCESS_TOKEN_KEY } from "../constants/storage.constant";
import { storage } from "../helpers/storage.helper";
import { logger } from "../helpers/logger.helper";

export const getAccessToken = async (interactive = true): Promise<string> => {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive }, async (tokenOrResult?: string | chrome.identity.GetAuthTokenResult) => {
      const token =
        typeof tokenOrResult === "string"
          ? tokenOrResult
          : tokenOrResult?.token;

      if (chrome.runtime.lastError || !token) {
        const error = chrome.runtime.lastError
          ? new Error(chrome.runtime.lastError.message)
          : new Error("No access token returned");

        logger.error("Auth error:", error.message);
        reject(error);
        return;
      }

      try {
        await storage.set({ [ACCESS_TOKEN_KEY]: token });
        logger.log("Access token stored successfully");
        resolve(token);
      } catch (storageErr) {
        logger.error("Failed to store token:", storageErr);
        reject(storageErr);
      }
    });
  });
}

export const getStoredToken = async (): Promise<string> => {
  const token = (await storage.get(ACCESS_TOKEN_KEY)) as string | undefined;
  return token || "";
};

export const checkLoginAndProceed = async (callback: () => Promise<void> | void): Promise<void> => {
  let token = await getStoredToken();

  if (!token) {
    token = await getAccessToken(false);
  }

  if (token) {
    await callback();
  } else {
    logger.error("[auth] No access token available, cannot proceed.");
  }
}