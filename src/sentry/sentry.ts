import OperationQueue from "./utils/operation-queue";
import { logger, report } from "./utils";
import ListenOnerror from "./listeners/listen-onerror";
import ListenError from "./listeners/listen-error";
import ListenUnhandledrejection from "./listeners/listen-unhandledrejection";
import ListenCustomError from "./listeners/listen-custom-error";
import ListenLocationChange from "./listeners/listen-location-change";
import ListenRequest from "./listeners/listen-request";
import ListenConsoleError from "./listeners/listen-console-error";

const QUEUE_MAX_LENGTH = 5;

const initSentry = () => {
  console.log('init sentry');
  const oprQueue = new OperationQueue(QUEUE_MAX_LENGTH);

  const reportError = (error: any) => {
    // showGlobalErrorUI
    const payload = {
      project: 'web',
      timestamp: new Date().toLocaleString(),
      url: window.location.href,
      breadcrumbs: oprQueue.get(),
      error: {
        ...error,
        stack: error.stack,
        message: error.message,
        name: error.name,
        type: error.type,
      },
    };
    logger.info('[web error stack]:', payload);
    // const compressed = await compress(payload);
    report(payload);
  }

  document.addEventListener("click", (e) => {
    try {
      const el = e.target as HTMLElement;
      const info = {
        type: "click",
        timestamp: new Date().toISOString(),
        target: `${el.tagName}${el.id ? "#" + el.id : ""}${
          el.className ? el.className : ""
        }`,
        text: el.innerText,
      };
      oprQueue.add(info);
    } catch (err) {
      console.log('[click error]:', err);
    }
  }, true);

  // window.onerror 错误
  ListenOnerror(reportError);

  // window.addEventListener("error") 错误
  ListenError(reportError);

  // promise 错误
  ListenUnhandledrejection(reportError);

  // window.dispatch 自定义错误
  ListenCustomError(reportError);

  // 监听所有路由变化
  ListenLocationChange(reportError);

  // 捕获 console.error 记录
  ListenConsoleError(reportError)

  // 监听所有请求状态
  ListenRequest(reportError);
}

initSentry();
