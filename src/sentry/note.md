## 错误捕获

错误如果没有被捕获，就会在控制台报出红色的错误 'Uncaught Error:...'

### try/catch

可以捕获常规运行时错误

语法错误和异步错误无法捕获

### window.onerror

可以捕获常规错误和异步错误

无法捕获资源错误、语法错误

```js
window.onerror = function(message, source, lineno, colno, error) {
  console.log('window.onerror', message, source, lineno, colno, error);
};
```
### window.addEventListener('error')

可以捕获资源加载错误，这是 onerror 无法监听的错误，资源加载错误没有冒泡阶段

现代浏览器的所有错误，都会触发 error 事件，包括语法错误、异步错误、资源加载错误
但是部分老版本浏览器只支持 onerror 事件

```js
window.addEventListener('error', function(event) {
  console.log('error', event);
}, true);
```

### window.addEventListener('unhandledrejection')

Promise 中抛出的错误，无法被 window.error try/catch error 事件捕获，可以通过 unhandledrejection 事件捕获

```js
window.addEventListener('unhandledrejection', function(event) {
  console.log('unhandledrejection', event);
  console.warn('unhandledrejection', event);
  event.preventDefault(); // 阻止默认行为，让错误不会传播到控制台打印
});
```

### Vue 项目

通过 `Vue.config.errorHandler` 配置全局错误处理

本质上还是通过包一层 try/catch 来捕获错误

```js
Vue.config.errorHandler = function(err, vm, info) {
  console.log('errorHandler', err, vm, info);
};
```

### React 项目

通过 `ErrorBoundary` 组件捕获错误

生产环境中，一旦被 ErrorBoundary 捕获，就不会触发 window.onerror 和 error 事件

要上报错误，就需要在 componentDidCatch 中上报

### 跨域问题

重写 xhr 和 fetch 请求，捕获请求错误，暂不需要

## 错误栈

`npm i -S error-stack-parser`
将错误信息栈解析为具体的文件和行号，可以解析哪些错误类型？

## 上报问题

将错误信息上报到后端，indexedDB，或者发送到 sentry 等第三方错误监控平台

在此之前可以考虑压缩和加密

## 源码定位

根据文件名远程加载 source map 文件，根据行列号获取原始代码
