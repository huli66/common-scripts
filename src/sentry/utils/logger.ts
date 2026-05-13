const shouldLog = window.location.search.includes('log=true');

export const logger = {
  info: (...args) => {
    if (!shouldLog) return;
    console.log(...args);
  },
  error: (...args) => {
    if (!shouldLog) return;
    console.error(...args);
  },
  warn: (...args) => {
    if (!shouldLog) return;
    console.warn(...args);
  },
  debug: (...args) => {
    if (!shouldLog) return;
    console.debug(...args);
  },
};