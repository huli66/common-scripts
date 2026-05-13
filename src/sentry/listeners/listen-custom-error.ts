import {logger} from "../utils";
import type { TListener } from "../types";

// window.dispatchEvent(new CustomEvent('app:error', {
//   detail: {
//     error: new Error('这是一个自定义错误'),
//     errorInfo: {
//       componentStack: '在某个组件中发生了错误'
//     }
//   }
// }));

/**
 * 监听 window.dispatch 的自定义错误
 */
const ListenCustomError: TListener = (report) => {
  window.addEventListener("app:error", (event: any) => {
    try {
      logger.info("[window.dispatchEvent custom error]:", event);
      const {error, errorInfo} = event.detail;
      const customError = {
        type: "custom_error",
        name: 'app:error',
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo ? errorInfo.componentStack : null,
      };
      report(customError);
    } catch (err) {
      console.log("[window.dispatchEvent custom error catch error]:", err);
    }
  });
};

export default ListenCustomError;
