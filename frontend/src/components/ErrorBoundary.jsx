import React from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error in Memory Bridge UI:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('mb_role');
    } catch (e) {}
    this.setState({ hasError: false, error: null });
    window.location.href = '/patient';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4 shadow-inner">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-emerald-950 mb-2">
            Something went wrong loading the Patient Dashboard
          </h1>
          <p className="text-slate-600 font-medium text-base mb-6 max-w-md">
            Don't worry, your data is safe. Click below to refresh and load Memory Bridge again.
          </p>
          <button
            onClick={this.handleReset}
            className="px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg shadow-xl flex items-center gap-2 border-2 border-emerald-400"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Reload Patient Dashboard</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
