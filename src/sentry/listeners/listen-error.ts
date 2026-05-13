import {logger} from "../utils";
import {IF_PREVENT_ERROR} from "../config";
import type { TListener } from "../types";

/** 监听错误 */
const ListenError: TListener = (report) => {
  window.addEventListener(
    "error",
    (e) => {
      try {
        // 运行时错误交给 onerror 上报，这里过滤避免重复上报
        console.log('e.target', e.target);
        if (e.target && e.target !== window) {
          logger.info("[addEventListener error]:", e);
          // const stack = getErrorStack(e.error);
          // logger.info("[addEventListener error stack]:", stack);
          const target = e.target as HTMLElement & { src?: string; href?: string }
          const message = `资源加载失败: ${target?.src || target?.href}`
          report({
            type: "resourceError",
            name: target?.tagName || '',
            stack: [],
            message,
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
