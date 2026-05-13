import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import ListenOnerror from '@sentry/listeners/listen-onerror'
import ListenError from '@sentry/listeners/listen-error'
import ListenUnhandledrejection from '@sentry/listeners/listen-unhandledrejection'
import ListenCustomError from '@sentry/listeners/listen-custom-error'
import ListenLocationChange from '@sentry/listeners/listen-location-change'
import ListenRequest from '@sentry/listeners/listen-request'

declare global {
  interface Window {
    __sentryLogs: any[]
  }
}

window.__sentryLogs = []

const reportError = (error: any) => {
  const payload = {
    timestamp: new Date().toLocaleTimeString(),
    ...error,
  }
  window.__sentryLogs.unshift(payload)
  window.dispatchEvent(new Event('sentry:log'))
}

ListenOnerror(reportError)
ListenError(reportError)
ListenUnhandledrejection(reportError)
ListenCustomError(reportError)
ListenLocationChange(reportError)
ListenRequest(reportError)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
