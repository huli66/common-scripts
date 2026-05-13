import {logger, getErrorStack} from "../utils";
import {IF_PREVENT_ERROR} from "../config";
import type { TListener } from "../types";

/** 监听错误 */
const ListenError: TListener = (report) => {
  window.addEventListener(
    "error",
    (e) => {
      try {
        if (e.target && e.target !== window) {
          logger.info("[addEventListener error]:", e);
          const stack = getErrorStack(e.error);
          logger.info("[addEventListener error stack]:", stack);
          report({
            type: "resourceError",
            name: "",
            stack,
            message: e.message,
            source: e.filename,
            lineno: e.lineno,
            colno: e.colno,
          });
          if (IF_PREVENT_ERROR) {
            e.preventDefault();
          }
        }
      } catch (err) {
        console.log("[addEventListener error catch error]:", err);
      }
    },
    true
  );
};

export default ListenError;
