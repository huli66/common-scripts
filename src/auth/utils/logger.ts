const isQa = window.location.href.includes('qbweb-qa');

export const logger = {
  info: (...args) => {
    if (isQa) {
      console.log(...args);
    }
  },
  error: (...args) => {
    if (isQa) {
      console.error(...args);
    }
  },
};