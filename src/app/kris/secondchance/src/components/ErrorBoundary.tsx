import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#121212] p-2">
          <div className="max-w-xs w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 text-center">
            <div className="flex justify-center mb-2">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
              Something went wrong
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-2 text-left">
                <summary className="cursor-pointer text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Error Details (Development)
                </summary>
                <pre className="text-xs bg-gray-100 dark:bg-gray-700 p-1.5 rounded overflow-auto max-h-16">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center px-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
} 