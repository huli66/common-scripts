import {logger, getErrorStack} from "../utils";
import {IF_PREVENT_ERROR} from "../config";
import type {TListener} from "../types";

/**
 * 监听未处理的 promise 错误
 */
const ListenUnhandledrejection: TListener = (report) => {
  window.addEventListener(
    "unhandledrejection",
    (e) => {
      try {
        logger.info("[unhandledrejection error]:", e);
        const stack = getErrorStack(e.reason);
        logger.info("[unhandledrejection error stack]:", stack);
        report({
          type: "unhandledrejection",
          name: "",
          stack,
          message: e.reason?.message,
        });
        if (IF_PREVENT_ERROR) {
          e.preventDefault();
        }
      } catch (err) {
        console.log("[unhandledrejection error catch error]:", err);
      }
    },
    true
  );
};

export default ListenUnhandledrejection;
