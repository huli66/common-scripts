import {getErrorStack} from "../utils";
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
        console.log('e', e, 'reson', e.reason)
        const stack = e.reason instanceof Error ? getErrorStack(e.reason) : [];
        const message = e.reason instanceof Error ? e.reason.message : String(e.reason);
        report({
          type: "unhandledrejection",
          name: "",
          stack: stack ?? [],
          message,
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
