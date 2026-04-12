let controller = new AbortController();

const getSignal = () => controller.signal;

const resetSignal = () => {
  controller.abort();
  controller = new AbortController();
};

const interceptor = () => {
  // 重写 xhr 和 fetch 方法，注入同一个 signal，有一个返回 401 就会 abort，触发全局的 abort 事件，打开登录弹窗
  // const originalXHROpen = XMLHttpRequest.prototype.open;
  // XMLHttpRequest.prototype.open = function (...args) {
  //   this.addEventListener("readystatechange", function () {
  //     if (this.readyState === 4 && this.status === 401) {
  //       console.log("401 detected, aborting all requests");
  //       // 触发全局的 abort 事件
  //       window.dispatchEvent(new Event("abort"));
  //     }
  //   });
  //   return originalXHROpen.apply(this, args);
  // };

  const originalFetch = window.fetch;
  window.fetch = function (input, init) {
    return new Promise((resolve, reject) => {
      originalFetch
        .apply(this, [input, { ...init, signal: getSignal() }])
        .then(async (response) => {
          // if (response.status === 401) {
          //   console.log("401 detected in fetch, aborting all requests");
          //   // 触发全局的 abort 事件
          //   resetSignal();
          //   window.dispatchEvent(new Event("OPEN_AUTH_DIALOG"));
          // }
          if (response.status === 200) {
            const data = await response.clone().json();
            if (data.status === 401) {
              console.log("fetch 401");
              resetSignal();
              window.dispatchEvent(new Event("OPEN_AUTH_DIALOG"));
            }
          }
          console.log("fetch response:", response);
          return resolve(response);
        })
        .catch((error) => {
          if (error.name === "AbortError") {
            console.log("Fetch aborted");
            return reject(new Error("Fetch aborted"));
          } else {
            return reject(error);
          }
        });
    });
  };
};

export default interceptor;
