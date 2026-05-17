import React from 'react';

const ThemeToggle = ({ theme, toggleTheme }) => {
  const isDark = theme === 'dark';
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={toggleTheme}
      onKeyDown={(e) => e.key === 'Enter' && toggleTheme()}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        position: 'absolute',
        top: '1.25rem',
        right: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3px',
        width: '56px',
        height: '30px',
        borderRadius: '999px',
        cursor: 'pointer',
        zIndex: 50,
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.15)',
        transition: 'background-color 0.3s',
        backgroundColor: isDark ? '#334155' : '#bfdbfe',
      }}
    >
      {/* Sliding thumb */}
      <div
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
          transform: isDark ? 'translateX(12px)' : 'translateX(-12px)',
          transition: 'transform 0.3s, background-color 0.3s',
          backgroundColor: isDark ? '#0f172a' : '#ffffff',
        }}
      >
        {isDark ? (
          /* Moon icon */
          <svg width="14" height="14" viewBox="0 0 20 20" fill="#93c5fd">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        ) : (
          /* Sun icon */
          <svg width="14" height="14" viewBox="0 0 20 20" fill="#f59e0b">
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 2.366a1 1 0 011.415 0l.707.707a1 1 0 01-1.414 1.415l-.707-.707a1 1 0 010-1.415zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zm-2.366 4.22a1 1 0 010 1.415l-.707.707a1 1 0 01-1.415-1.414l.707-.707a1 1 0 011.415 0zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4.22-2.366a1 1 0 010-1.415l.707-.707a1 1 0 011.415 1.414l-.707.707a1 1 0 01-1.415 0zM4 10a1 1 0 01-1 1H2a1 1 0 110-2h1a1 1 0 011 1zm2.366-4.22a1 1 0 011.415 0l.707.707a1 1 0 01-1.415 1.415l-.707-.707a1 1 0 010-1.415zM10 5a5 5 0 100 10 5 5 0 000-10z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
    </div>
  );
};

export default ThemeToggle;
