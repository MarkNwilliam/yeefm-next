// src/utils/ErrorBoundary.tsx
'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = (): void => {
    window.location.reload();
  };

  handleRetry = (): void => {
    this.setState({ hasError: false });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 m-4 max-w-md mx-auto">
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-6 h-6 text-amber-500 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">
              Loading Error
            </h3>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-2">
              Failed to load component. This might be due to a connection issue.
            </p>
            <p className="text-sm text-gray-500">
              Please try refreshing the page or check your internet connection.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={this.handleRetry}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
            
            <button
              onClick={this.handleReload}
              className="flex items-center justify-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors duration-200"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;