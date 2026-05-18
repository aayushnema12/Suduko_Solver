import React, { useEffect } from 'react';

const ToastNotification = ({ message, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!message) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-down">
      <div className="bg-red-500/90 backdrop-blur-md text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 ring-1 ring-red-600/50">
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-medium text-sm sm:text-base whitespace-nowrap">
          {message}
        </span>
        <button
          onClick={onClose}
          className="ml-2 hover:bg-white/20 p-1 rounded-full transition-colors focus:outline-none"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ToastNotification;
