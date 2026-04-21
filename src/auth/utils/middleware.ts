import { JUMP_LOGIN_EVENT } from "../config";

let controller = new AbortController();

const getSignal = () => controller.signal;

const resetSignal = () => {
  controller.abort();
  controller = new AbortController();
};

const rewriteXHR = () => {
  const _open = XMLHttpRequest.prototype.open;
  const _send = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function(method, url, ...args) {
    this._method = method;
    this._url = url;
    return _open.apply(this, [method, url, ...args]);
  };

  XMLHttpRequest.prototype.send = function(...args) {
    const globalSignal = getSignal();

    globalSignal.addEventListener('abort', () => {
      console.log("XHR aborted", this);
      this.abort();
    }, {once: true});

    this.addEventListener('readystatechange', function() {
      if (this.readyState === XMLHttpRequest.DONE) {
        console.log(`[XHR] ${this._method} ${this._url}, ${this.status}, ${this.response?.status}, ${this.response?.message}`);

        if (this.status === 401) {
          console.log("[XHR] status 401 detected");
          resetSignal();
          window.dispatchEvent(new Event(JUMP_LOGIN_EVENT));
        }

        if (this.response?.status === 401) {
          console.log("[XHR] code 401 detected");
          resetSignal();
          window.dispatchEvent(new Event(JUMP_LOGIN_EVENT));
        }
      }
    });

    return _send.apply(this, args);
  };
}

const rewriteFetch = () => {
  const originalFetch = window.fetch;
  window.fetch = function (input, init) {
    return new Promise((resolve, reject) => {
      originalFetch
        .apply(this, [input, { ...init, signal: getSignal() }])
        .then(async (response) => {
          if (response.status === 401) {
            console.log("[Fetch] status 401 detected");
            // 触发全局的 abort 事件
            resetSignal();
            window.dispatchEvent(new Event(JUMP_LOGIN_EVENT));
          }
          if (response.status === 200) {
            const contentType = response.headers.get("Content-Type");
            // 有必要可以添加上 url 检查是否 /node/api/k8s
            if (contentType?.includes("application/json")) {
              try {
                const data = await response.clone().json();
                if (data.status === 401) {
                  console.log("[Fetch] code 401 detected");
                  resetSignal();
                  window.dispatchEvent(new Event(JUMP_LOGIN_EVENT));
                  return reject(new Error("Fetch response is 401"));
                }
              } catch (error) {
                console.warn("Fetch response is not json", error)
              }
            }
            return resolve(response);
          }
          return reject(new Error("Fetch response is not 200"));
        })
        .catch((error) => {
          console.log('error', error)
          if (error.name === "AbortError") {
            console.log("Fetch aborted");
            return reject(new Error("Fetch aborted"));
          } else {
            return reject(error);
          }
        });
    });
  };
}

const interceptor = () => {
  // 重写 xhr 和 fetch 方法，注入同一个 signal，有一个返回 401 就会 abort，触发全局的 abort 事件，打开登录弹窗
  
  rewriteXHR();
  rewriteFetch();
};

export default interceptor;
