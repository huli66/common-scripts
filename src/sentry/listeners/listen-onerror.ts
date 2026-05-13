import {logger, getErrorStack} from "../utils";
import {IF_PREVENT_ERROR} from "../config";
import type { TListener } from "../types";

const ListenOnerror: TListener = (report) => {
  window.onerror = (message, source, lineno, colno, error) => {
    try {
      logger.info("[window.onerror]:", message, source, lineno, colno, error);
      let stack = [];
      if (error) {
        stack = getErrorStack(error);
        logger.info("[window.onerror stack]:", stack);
      } else {
        const syntheticError = new Error(message as string);
        syntheticError.stack = `${message}\n    at ${source}:${lineno}:${colno}`;
        stack = getErrorStack(syntheticError);
        logger.info("[window.onerror stack(synthetic)]:", stack);
      }
      report({
        type: "error",
        name: "",
        stack,
        message: String(message),
        source,
        lineno,
        colno,
      });
      if (IF_PREVENT_ERROR) {
        return true;
      }
    } catch (err) {
      console.log("[window.onerror catch error]:", err);
    }
  };
};

export default ListenOnerror;
