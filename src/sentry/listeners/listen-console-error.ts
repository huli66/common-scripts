import {getErrorStack, logger} from "../utils";
import type { TListener } from "../types";

/**
 * 捕获 console.error 记录，记录 error-boundary 错误
 */
const ListenConsoleError: TListener = (report) => {
  const originalConsoleError = console.error;

  console.error = function (...args) {
    const arg1 = args?.[1];
    const arg2 = args?.[2];
    try {
      if (typeof arg2 === 'string' && arg2?.includes('The above error occurred in')) {
        if (typeof arg1 === 'object' && arg1 instanceof Error) {
          const stack = getErrorStack(arg1);
          report({
            type: 'console_error',
            name: 'react_boundary_error',
            message: arg1?.message || '',
            stack,
          });
        }
      }
    } catch (err) {
      console.log('[listen console error]:', err);
    }
    originalConsoleError.apply(console, args);
  };
};

export default ListenConsoleError;
