import React from 'react';

const ConflictCounter = ({ count }) => {
  if (count === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium transition-all duration-300">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        No conflicts
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-red-500 dark:text-red-400 font-medium animate-shake transition-all duration-300">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      {count} conflict{count !== 1 ? 's' : ''} found
    </div>
  );
};

export default ConflictCounter;
