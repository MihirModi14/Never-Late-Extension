import { ACCESS_TOKEN_KEY } from "../constants/storage.constant";
import { storage } from "./storage.helper";
import { logger } from "./logger.helper";

export const auth = {
  /**
   * Get stored access token from extension storage.
   */
  getStoredToken: async (): Promise<string> => {
    const token = (await storage.get(ACCESS_TOKEN_KEY)) as string | undefined;
    return token || "";
  },

  /**
   * Get a new access token (login flow).
   * @param interactive If false, won't show popup if not logged in.
   */
  getAccessToken: async (interactive = true): Promise<string> => {
    return new Promise((resolve, reject) => {
      chrome.identity.getAuthToken(
        { interactive },
        async (tokenOrResult?: string | chrome.identity.GetAuthTokenResult) => {
          const token =
            typeof tokenOrResult === "string"
              ? tokenOrResult
              : tokenOrResult?.token;

          if (chrome.runtime.lastError || !token) {
            const error = chrome.runtime.lastError
              ? new Error(chrome.runtime.lastError.message)
              : new Error("No access token returned");

            logger.error("[auth] Token fetch error:", error.message);
            reject(error);
            return;
          }

          try {
            await storage.set({ [ACCESS_TOKEN_KEY]: token });
            logger.info("[auth] Access token stored successfully");
            resolve(token);
          } catch (storageErr) {
            logger.error("[auth] Failed to store token:", storageErr);
            reject(storageErr);
          }
        }
      );
    });
  },

  /**
   * Check login; if not logged in, perform login, then run callback.
   */
  checkAndProceed: async (callback: () => Promise<void> | void): Promise<void> => {
    try {
      let token = await auth.getStoredToken();

      if (!token) {
        logger.info("[auth] No stored token found, attempting login...");
        token = await auth.getAccessToken(false);
      }

      if (token) {
        logger.info("[auth] Token available, proceeding...");
        await callback();
      } else {
        logger.error("[auth] No access token available, cannot proceed.");
      }
    } catch (err) {
      logger.error("[auth] Error during login check:", err);
    }
  },

  /**
   * Force logout (invalidate token and remove from storage).
   */
  logout: async (): Promise<void> => {
    try {
      const token = await auth.getStoredToken();
      if (token) {
        chrome.identity.removeCachedAuthToken({ token }, async () => {
          await storage.remove(ACCESS_TOKEN_KEY);
          logger.info("[auth] Token removed successfully.");
        });
      }
    } catch (err) {
      logger.error("[auth] Logout failed:", err);
    }
  },
};
