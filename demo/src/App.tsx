import { useState } from 'react'
import ErrorBoundary from './ErrorBoundary'
import LogPanel from './LogPanel'
import axios from 'axios'

function BrokenComponent() {
  throw new Error('React 组件内部抛出异常')
}

const BUTTON_STYLE: React.CSSProperties = {
  padding: '8px 14px',
  borderRadius: 6,
  border: '1px solid #ddd',
  background: '#fff',
  cursor: 'pointer',
  fontSize: 13,
}

const obj: any = null;

export default function App() {
  const [showBroken, setShowBroken] = useState(false)

  const actions: { label: string; listener: string; trigger: () => void }[] = [
    {
      label: 'JS 异步运行时错误',
      listener: 'listen-onerror',
      trigger: () => {
        setTimeout(() => {
          // @ts-ignore
          null.foo
        }, 1000)
      },
    },
    {
      label: 'JS 运行时错误',
      listener: 'listen-onerror && listen-error',
      trigger: () => {
        console.log(obj[1])
      },
    },
    {
      label: '资源加载失败',
      listener: 'listen-error',
      trigger: () => {
        const img = new Image()
        img.src = '/not-exist-image-12345.png'
        document.body.appendChild(img)
        setTimeout(() => img.remove(), 3000)
      },
    },
    {
      label: 'Promise 未捕获',
      listener: 'listen-unhandledrejection',
      trigger: () => {
        Promise.reject(new Error('未处理的 Promise rejection'))
      },
    },
    {
      label: 'axios 请求错误',
      listener: 'listen-request',
      trigger: () => {
        axios.get('/node/api/user')
      },
    },
    {
      label: 'fetch 请求错误',
      listener: 'listen-request',
      trigger: () => {
        fetch('/node/api/user')
      },
    },
    {
      label: '自定义事件错误',
      listener: 'listen-custom-error',
      trigger: () => {
        window.dispatchEvent(
          new CustomEvent('app:error', {
            detail: {
              error: new Error('手动 dispatch 的自定义错误'),
              errorInfo: { componentStack: '手动触发，无组件堆栈' },
            },
          }),
        )
      },
    },
    {
      label: 'history.pushState',
      listener: 'listen-location-change',
      trigger: () => history.pushState({}, '', `/page-${Date.now()}`),
    },
    {
      label: 'history.replaceState',
      listener: 'listen-location-change',
      trigger: () => history.replaceState({}, '', `/replaced-${Date.now()}`),
    },
    {
      label: '浏览器后退 (popstate)',
      listener: 'listen-location-change',
      trigger: () => history.back(),
    },
  ]

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '24px 16px', fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: 4 }}>Sentry Listeners Demo</h2>
      <p style={{ color: '#666', fontSize: 13, marginBottom: 24 }}>
        点击按钮触发各类错误，观察下方日志面板捕获情况
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
        {actions.map(({ label, listener, trigger }) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <button style={BUTTON_STYLE} onClick={trigger}>
              {label}
            </button>
            <span style={{ fontSize: 11, color: '#999', textAlign: 'center' }}>{listener}</span>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <strong style={{ fontSize: 13 }}>React 组件崩溃（ErrorBoundary + listen-custom-error）</strong>
        </div>
        <ErrorBoundary>
          {showBroken ? (
            <BrokenComponent />
          ) : (
            <button style={BUTTON_STYLE} onClick={() => setShowBroken(true)}>
              渲染崩溃组件
            </button>
          )}
        </ErrorBoundary>
        {showBroken === false ? null : (
          <button
            style={{ ...BUTTON_STYLE, marginTop: 8, fontSize: 12, color: '#666' }}
            onClick={() => setShowBroken(false)}
          >
            重置
          </button>
        )}
      </div>

      <hr style={{ borderColor: '#eee', marginBottom: 24 }} />

      <LogPanel />
    </div>
  )
}
