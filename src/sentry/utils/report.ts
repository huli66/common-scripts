import { REPORT_API_URL } from "../config";

export const report = (error: any) => {
  try {
    const blob = new Blob([JSON.stringify({logText: error})], {type: 'application/json'})
    navigator.sendBeacon(REPORT_API_URL, blob);
  } catch (err) {
    console.log("[sendBeacon error]:", err);
  } 
};

export const readReport = () => {};
