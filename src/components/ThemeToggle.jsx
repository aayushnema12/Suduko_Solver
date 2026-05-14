import React from 'react';

const ThemeToggle = ({ theme, toggleTheme }) => {
  const isDark = theme === 'dark';
  return (
    <div 
      className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center justify-center p-1 bg-blue-100 dark:bg-slate-700 rounded-full cursor-pointer w-14 h-8 transition-colors duration-300 shadow-inner"
      onClick={toggleTheme}
      aria-label="Toggle Dark Mode"
    >
      <div 
        className={`w-6 h-6 bg-white dark:bg-slate-900 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${
          isDark ? 'translate-x-3' : '-translate-x-3'
        }`}
      >
        {isDark ? (
          <svg className="w-4 h-4 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
          </svg>
        ) : (
          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 2.366a1 1 0 011.415 0l.707.707a1 1 0 01-1.414 1.415l-.707-.707a1 1 0 010-1.415zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zm-2.366 4.22a1 1 0 010 1.415l-.707.707a1 1 0 01-1.415-1.414l.707-.707a1 1 0 011.415 0zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4.22-2.366a1 1 0 010-1.415l.707-.707a1 1 0 011.415 1.414l-.707.707a1 1 0 01-1.415 0zM4 10a1 1 0 01-1 1H2a1 1 0 110-2h1a1 1 0 011 1zm2.366-4.22a1 1 0 011.415 0l.707.707a1 1 0 01-1.415 1.415l-.707-.707a1 1 0 010-1.415zM10 5a5 5 0 100 10 5 5 0 000-10z" clipRule="evenodd"></path>
          </svg>
        )}
      </div>
    </div>
  );
};
export default ThemeToggle;
