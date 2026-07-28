'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught UI error:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 text-center">
          <div className="glass-panel p-8 rounded-3xl max-w-md w-full border border-[rgba(244,63,94,0.3)] bg-[rgba(244,63,94,0.05)] shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-[rgba(244,63,94,0.15)] text-rose-500 flex items-center justify-center mx-auto mb-4 border border-[rgba(244,63,94,0.3)]">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-[var(--text)] mb-2">
              حدث خطأ غير متوقع / Something went wrong
            </h2>
            <p className="text-xs text-[var(--text-dim)] mb-6 font-mono leading-relaxed">
              {this.state.error?.message || 'An unexpected rendering error occurred.'}
            </p>
            <button
              onClick={this.handleReset}
              className="w-full py-3 rounded-xl bg-[var(--text)] text-[var(--bg)] font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg"
            >
              <RefreshCw className="w-4 h-4" />
              <span>إعادة تحميل الصفحة / Reload App</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
