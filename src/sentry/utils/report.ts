import { REPORT_API_URL } from "../config";

const MAX_PER = 5;
const WINDOW_START = 30 * 1000;
const timestamps: number[] = [];

const isOverLimit = () => {
  const now = Date.now();
  
  while(timestamps.length > 0 && now - timestamps[0] > WINDOW_START) {
    timestamps.shift();
  }
  return timestamps.length > MAX_PER;
}

export const report = (error: any) => {
  try {
    if (isOverLimit()) return;
    const blob = new Blob([JSON.stringify({logText: error})], {type: 'application/json'})
    navigator.sendBeacon(REPORT_API_URL, blob);
  } catch (err) {
    console.log("[sendBeacon error]:", err);
  } 
};

export const readReport = () => {};
