import type { TListener } from "../types";

/**
 * 监听所有路由变化
 */
const ListenLocationChange: TListener = (report) => {
  window.addEventListener("popstate", () => {
    report({
      type: "LOCATION_CHANGE",
      message: "popState",
      stack: [],
      name: "",
    });
  });

  const _push = window.history.pushState.bind(window.history);
  window.history.pushState = (...args) => {
    _push(...args);
    report({
      type: "LOCATION_CHANGE",
      message: "history pushState",
      stack: [],
      name: "",
    });
  };

  const _replace = window.history.replaceState.bind(window.history);
  window.history.replaceState = (...args) => {
    _replace(...args);
    report({
      type: "LOCATION_CHANGE",
      message: "history replaceState",
      stack: [],
      name: "",
    });
  };
};

export default ListenLocationChange;
