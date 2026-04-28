const originalConsoleError = console.error;

console.error = function (...args) {
  const msg = args[0];
  if (typeof msg === "string" && msg.includes("React")) {
    // 实际验证一下 error-boundary 报错之后到输出
    const error = {
      type: 'react_boundary_error',
      message: args[0],
      componentStack: args[1]
    }
  }
  originalConsoleError.apply(console, args);
}


// 各个项目内，也可以主动发送错误信息

window.dispatchEvent(new CustomEvent('app:error', {
  detail: {
    error: new Error('这是一个自定义错误'),
    errorInfo: {
      componentStack: '在某个组件中发生了错误'
    }
  }
}));

window.addEventListener('app:error', (event: any) => {
  const { error, errorInfo } = event.detail;
  const customError = {
    type: 'custom_error',
    message: error.message,
    stack: error.stack,
    componentStack: errorInfo ? errorInfo.componentStack : null
  }

  // sendBecaon();

  showGlobalErrorUI(error);
})

function showGlobalErrorUI(e) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed; bottom: 20px; right: 20px;
    background: #ff4d4f; color: white;
    padding: 12px 20px; border-radius: 8px;
    z-index: 9999; max-width: 300px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  `
  toast.innerHTML = `
    <div>页面出现错误，请刷新重试</div>
    <button onclick="location.reload()"
      style="margin-top:8px; background:white;
             color:#ff4d4f; border:none;
             padding:4px 12px; border-radius:4px; cursor:pointer">
      刷新页面
    </button>
  `
  document.body.appendChild(toast)
}