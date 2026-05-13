import {logger} from "../utils";
import type { TListener } from "../types";

/**
 * 捕获 console.error 记录，记录 error-boundary 错误
 */
const ListenConsoleError: TListener = (report) => {
  const originalConsoleError = console.error;

  console.error = function (...args) {
    const msg = args[0];
    if (typeof msg === "string" && msg.includes("React")) {
      try {
        // 实际验证一下 error-boundary 报错之后到输出
        logger.info("[react boundary error]:", msg);
        const error = {
          type: "react_boundary_error",
          message: args[0],
          componentStack: args[1],
        };
        report(error);
      } catch (err) {
        console.log("[listen console error error]:", err);
      }
    }
    originalConsoleError.apply(console, args);
  };
};

export default ListenConsoleError;
