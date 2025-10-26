import { getCalendarEventsApi } from "./calendar";
import { getAccessToken, getStoredToken } from './auth'
import { logger } from "../helpers/logger.helper";
import "./alarm";
import { storage } from "../helpers/storage.helper";

chrome.runtime.onInstalled.addListener(async () => {
  storage.clear();
  let token = await getStoredToken();
  if (!token) {
    token = await getAccessToken(false);
  }
  if (token) {
    getCalendarEventsApi();
  } else {
    logger.error("No access token available.");
  }
});

