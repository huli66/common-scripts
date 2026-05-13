import type { TListener } from "../types";

/**
 * 监听所有请求状态
 */
const ListenRequest: TListener = (report) => {
  const _open = XMLHttpRequest.prototype.open;
  const _send = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (method, url, ...args) {
    this._method = method;
    this._url = url;
    return _open.apply(this, [method, url, ...args]);
  };

  XMLHttpRequest.prototype.send = function (...args) {
    this.addEventListener("readystatechange", function () {
      if (this.readyState === XMLHttpRequest.DONE) {
        report({
          type: "XHR",
          message: `[XHR] ${this._method} ${this._url}, s: ${this.status}, rs: ${this.response?.status}, msg: ${this.response?.message}`,
          stack: [],
          name: "",
        });
      }
    });

    return _send.apply(this, args);
  };

  const _fetch = window.fetch.bind(window);

  window.fetch = async function (input, init, ...args) {
    const url = input instanceof Request ? input.url : input;
    const method = (init?.method || "GET").toUpperCase();

    const response = await _fetch(input, init, ...args);

    // clone 一份，避免 body 只能读一次
    const clone = response.clone();
    clone.text().then((body) => {
      report({
        type: "FETCH",
        message: `[Fetch] ${method} ${url}, s: ${response.status}, rs: ${response.response?.status}, msg: ${response.response?.message}`,
        stack: [],
        name: "",
      });
    });

    return response;
  };
};

export default ListenRequest;
