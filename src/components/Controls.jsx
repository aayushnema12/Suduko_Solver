import React from 'react';

const IconSolve = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconHint = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const IconUndo = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
  </svg>
);

const IconReset = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const IconSample = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const IconCamera = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ControlButton = ({ onClick, disabled, label, icon, variant = 'default', className = '' }) => {
  const variants = {
    default: `bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-200
      hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-gray-300 dark:hover:border-slate-500 hover:text-gray-900 dark:hover:text-white
      disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-slate-800 disabled:hover:border-gray-200 dark:disabled:hover:border-slate-600`,
    primary: `bg-blue-500 border border-blue-500 text-white
      hover:bg-blue-600 hover:border-blue-600
      disabled:opacity-40 disabled:cursor-not-allowed`,
    danger: `bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900/50 text-red-500 dark:text-red-400
      hover:bg-red-50 dark:hover:bg-red-900/30 hover:border-red-300 dark:hover:border-red-800
      disabled:opacity-40 disabled:cursor-not-allowed`,
    success: `bg-emerald-500 border border-emerald-500 text-white
      hover:bg-emerald-600 hover:border-emerald-600
      disabled:opacity-40 disabled:cursor-not-allowed`,
    purple: `bg-purple-500 border border-purple-500 text-white
      hover:bg-purple-600 hover:border-purple-600
      disabled:opacity-40 disabled:cursor-not-allowed`,
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`
        flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-sm font-medium
        transition-all duration-150 active:scale-95 shadow-sm select-none
        ${variants[variant]} ${className}
      `}
    >
      {icon}
      <span className="hidden xs:inline sm:inline">{label}</span>
    </button>
  );
};

const Controls = ({
  onSolve,
  onHint,
  onUndo,
  onReset,
  onLoadSample,
  onCamera,
  canUndo,
  isSolving,
  noSolution,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <ControlButton
          onClick={onSolve}
          label={isSolving ? 'Solving…' : 'Solve'}
          icon={<IconSolve />}
          variant="success"
          disabled={isSolving}
        />
        <ControlButton
          onClick={onHint}
          label="Hint"
          icon={<IconHint />}
          variant="primary"
          disabled={isSolving}
        />
        <ControlButton
          onClick={onUndo}
          label="Undo"
          icon={<IconUndo />}
          variant="default"
          disabled={!canUndo || isSolving}
        />
        <ControlButton
          onClick={onCamera}
          label="Scan"
          icon={<IconCamera />}
          variant="purple"
          disabled={isSolving}
        />
        <ControlButton
          onClick={onLoadSample}
          label="Sample"
          icon={<IconSample />}
          variant="default"
          disabled={isSolving}
        />
        <ControlButton
          onClick={onReset}
          label="Reset"
          icon={<IconReset />}
          variant="danger"
          disabled={isSolving}
        />
      </div>

      {noSolution && (
        <div className="flex items-center justify-center gap-2 text-sm text-red-600 dark:text-red-400 font-medium
          bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-xl px-4 py-2 animate-fill-in">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          No solution found for this puzzle.
        </div>
      )}
    </div>
  );
};

export default Controls;
