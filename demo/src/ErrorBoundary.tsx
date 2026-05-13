import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    window.dispatchEvent(
      new CustomEvent('app:error', {
        detail: { error, errorInfo },
      }),
    )
  }

  reset = () => this.setState({ hasError: false })

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '12px', background: '#fff3f3', border: '1px solid #f88', borderRadius: 6 }}>
          <strong>组件崩溃了</strong>
          <button onClick={this.reset} style={{ marginLeft: 12 }}>重置</button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
