const showGlobalErrorUI = (e) => {
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
};

export default showGlobalErrorUI;
