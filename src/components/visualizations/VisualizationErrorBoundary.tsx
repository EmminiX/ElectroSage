"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface VisualizationErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  visualizationType?: string;
}

interface VisualizationErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class VisualizationErrorBoundary extends Component<
  VisualizationErrorBoundaryProps,
  VisualizationErrorBoundaryState
> {
  constructor(props: VisualizationErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): VisualizationErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Visualization Error Boundary caught an error:', {
      error,
      errorInfo,
      visualizationType: this.props.visualizationType,
      timestamp: new Date().toISOString(),
    });

    this.setState({
      error,
      errorInfo,
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h4 className="text-red-900 font-semibold">
              Visualization Error
            </h4>
          </div>
          
          <p className="text-red-800 text-sm mb-3">
            {this.props.visualizationType 
              ? `Failed to load ${this.props.visualizationType} visualization.`
              : 'Failed to load visualization.'
            }
          </p>
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mb-3">
              <summary className="text-red-700 text-sm cursor-pointer">
                Error Details (Development)
              </summary>
              <pre className="text-xs bg-red-100 p-2 rounded mt-2 overflow-auto">
                {this.state.error.message}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
          
          <button
            onClick={this.handleRetry}
            className="flex items-center space-x-2 px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default VisualizationErrorBoundary;