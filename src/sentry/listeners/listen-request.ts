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
        console.log('xhr this', this);
        if (this.responseType === '' || this.responseType === 'text') {
          try {
            const body = JSON.parse(this.responseText);
            report({
              type: "XHR",
              name: this?.status || '',
              message: `[XHR] ${this._method} ${this._url}, rs: ${body?.status}, msg: ${body.message}`,
              stack: [],
            });
          } catch (err) {
            report({
              type: "XHR",
              name: this?.status || '',
              message: `[XHR] ${this._method} ${this._url}, 无法读取返回数据`,
              stack: [],
            });
          }
        } else {
          report({
            type: "XHR",
            name: this?.status || '',
            message: `[XHR] ${this._method} ${this._url}, 无法读取返回数据`,
            stack: [],
          });
        }
      }
    });

    return _send.apply(this, args);
  };

  const _fetch = window.fetch.bind(window);

  window.fetch = async function (input, init, ...args) {
    const url = input instanceof Request ? input.url : input;
    const method = (init?.method || "GET").toUpperCase();

    try {                                               
      const response = await _fetch(input, init, ...args)
      const clone = response.clone();
      const contentType = clone.headers.get('Content-Type') || '';
      if (contentType.includes('application/json')) {
        clone.json().then((body) => {
          report({
            type: "FETCH",
            name: clone?.status || '',
            message: `[Fetch] ${method} ${url}, rs: ${body?.status}, msg: ${body?.message}`,
            stack: [],
          });
        });
      } else if (contentType.includes('text/plain')) {
        clone.text().then((body) => {
          report({
            type: "FETCH",
            name: clone?.status || '',
            message: `[Fetch] ${method} ${url}, s: ${clone.status}, application/text`,
            stack: [],
          });
        });
      } else {
        report({
          type: "FETCH",
          name: clone?.status || '',
          message: `[Fetch] ${method} ${url}, 非 applycation/json | application/text 类型`,
          stack: [],
        });
      }                                                                
      return response;                               
    } catch (err: any) {
      report({                                   
        type: 'FETCH',
        message: `[Fetch] ${method} ${url}, msg: ${err?.message}`,     
        stack: [],
        name: 'FETCH_ERROR',                                                          
      })                                                
      throw err
    }
  };
};

export default ListenRequest;
