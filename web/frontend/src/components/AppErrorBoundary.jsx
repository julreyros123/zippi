import React from 'react';

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('UI crash captured by AppErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-6">
          <div className="max-w-xl w-full rounded-xl border border-red-800/50 bg-red-950/20 p-6">
            <h1 className="text-lg font-bold text-red-300">Something went wrong in the UI</h1>
            <p className="text-sm text-red-100/90 mt-2">
              The chat view crashed, but the app is still running. Refresh the page once, and if it happens again,
              this error message helps us debug instead of showing a blank screen.
            </p>
            {this.state.error?.message && (
              <pre className="mt-4 text-xs whitespace-pre-wrap break-words bg-black/30 rounded-md p-3 border border-red-900/40">
                {this.state.error.message}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
