import { REPORT_API_URL } from "../config";

const MAX_PER = 5;
const WINDOW_START = 1 * 1000;
const timestamps: number[] = [];

const isOverLimit = () => {
  const now = Date.now();
  // console.log('isOverLimit', timestamps);
  
  while(timestamps.length > 0 && now - timestamps[0] > WINDOW_START) {
    timestamps.shift();
  }

  if (timestamps.length >= MAX_PER) {
    return true;
  }

  timestamps.push(now);
  return false;
}

export const report = (error: any) => {
  try {
    // console.log('report', error);
    if (isOverLimit()) return;
    const blob = new Blob([JSON.stringify({logText: JSON.stringify(error)})], {type: 'application/json'})
    navigator.sendBeacon(REPORT_API_URL, blob);
  } catch (err) {
    console.log("[sendBeacon error]:", err);
  } 
};

export const readReport = () => {};
