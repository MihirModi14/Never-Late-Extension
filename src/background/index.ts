import { auth } from "@NeverLate/utils/services/auth.service";
import "./alarm";
import './message'

chrome.runtime.onInstalled.addListener(async () => {
  auth.login();
});

