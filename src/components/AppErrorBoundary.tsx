import { Component, type ErrorInfo, type ReactNode } from 'react'

type AppErrorBoundaryProps = {
  children: ReactNode
}

type AppErrorBoundaryState = {
  hasError: boolean
}

export default class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Portfolio render error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg-dark text-white font-sans flex items-center justify-center p-6">
          <div className="max-w-md border border-white/10 bg-white/[0.03] rounded-xl p-6 text-center">
            <div className="font-mono text-[10px] tracking-[0.2em] text-accent uppercase mb-3">
              Render Error
            </div>
            <h1 className="text-2xl font-bold mb-3">Something needs a quick refresh.</h1>
            <p className="text-white/50 text-sm leading-relaxed mb-5">
              The page hit unexpected content data. Reloading usually recovers after the data is fixed.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 border border-accent/40 text-accent font-mono text-[11px] tracking-widest uppercase hover:bg-accent/10 transition-colors"
            >
              Reload
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
