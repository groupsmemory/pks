'use client';

import React, { Component, type ReactNode, type ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: unknown[];
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

const DefaultFallback = ({
  error,
  reset,
  isHighContrast,
}: {
  error: Error;
  reset: () => void;
  isHighContrast: boolean;
}) => {
  const bg = isHighContrast
    ? 'bg-[#000000] border-2 border-[#FFFF00]'
    : 'bg-red-50 border border-red-200';
  const text = isHighContrast ? 'text-[#FFFF00]' : 'text-red-800';
  const subtext = isHighContrast ? 'text-[#FFFF00] opacity-80' : 'text-red-600';
  const btnBg = isHighContrast
    ? 'bg-[#FFFF00] text-[#000000] hover:bg-[#FFFF00] hover:text-[#000000]'
    : 'bg-red-600 text-white hover:bg-red-700';
  const detailBg = isHighContrast
    ? 'bg-[#000000] border border-[#FFFF00]'
    : 'bg-red-100';

  return (
    <div role="alert" className={`rounded-xl p-6 my-4 max-w-2xl mx-auto ${bg}`}>
      <div className="flex items-start gap-4">
        <span aria-hidden="true" className="text-2xl mt-0.5">⚠️</span>
        <div className="flex-1 min-w-0">
          <h2 className={`text-lg font-bold mb-2 ${text}`}>
            Terjadi Kesalahan
          </h2>
          <p className={`text-sm mb-4 ${subtext}`}>
            Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi.
          </p>
          <button
            type="button"
            onClick={reset}
            className={`min-h-[44px] min-w-[44px] px-6 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-4 ${btnBg}`}
          >
            Coba Lagi
          </button>
          <details className="mt-4">
            <summary className={`text-xs cursor-pointer focus:outline-none focus:ring-4 rounded px-1 ${subtext}`}>
              Detail teknis
            </summary>
            <pre className={`mt-2 p-3 rounded text-xs overflow-auto max-h-32 ${detailBg} ${text}`}>
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
};

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (typeof console !== 'undefined') {
      console.error('[ErrorBoundary]', error, errorInfo);
    }
    this.props.onError?.(error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    if (!this.state.hasError) return;
    if (
      this.props.resetKeys &&
      prevProps.resetKeys !== this.props.resetKeys
    ) {
      this.reset();
    }
  }

  reset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        if (typeof this.props.fallback === 'function') {
          return this.props.fallback(this.state.error, this.reset);
        }
        return this.props.fallback;
      }

      return (
        <ErrorBoundaryConsumer>
          {(isHighContrast) => (
            <DefaultFallback
              error={this.state.error!}
              reset={this.reset}
              isHighContrast={isHighContrast}
            />
          )}
        </ErrorBoundaryConsumer>
      );
    }

    return this.props.children;
  }
}

function ErrorBoundaryConsumer({
  children,
}: {
  children: (isHighContrast: boolean) => ReactNode;
}) {
  const [isHighContrast, setIsHighContrast] = React.useState(false);

  React.useEffect(() => {
    const check = () =>
      setIsHighContrast(
        document.documentElement.classList.contains('high-contrast'),
      );
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  return <>{children(isHighContrast)}</>;
}
