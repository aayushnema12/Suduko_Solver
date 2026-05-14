import React, { useRef, useEffect } from 'react';

/**
 * Individual Sudoku cell.
 * cellType: 'user' | 'hint' | 'solved' | 'empty'
 */
const Cell = ({
  value,
  row,
  col,
  cellType,
  isConflict,
  isFocused,
  isHighlighted,
  onChange,
  onFocus,
  onKeyDown,
  animateIn,
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (isFocused) inputRef.current?.focus();
  }, [isFocused]);

  // Determine text color
  const textColor = () => {
    if (isConflict) return 'text-red-500 dark:text-red-400';
    if (cellType === 'hint') return 'text-blue-500 dark:text-blue-400';
    if (cellType === 'solved') return 'text-emerald-600 dark:text-emerald-400';
    if (cellType === 'user') return 'text-gray-800 dark:text-gray-100';
    return 'text-gray-400 dark:text-gray-500';
  };

  // Determine background color
  const bgColor = () => {
    if (isConflict) return 'bg-rose-100 dark:bg-rose-900/30';
    if (isFocused) return 'bg-blue-50 dark:bg-blue-900/40';
    if (isHighlighted) return 'bg-slate-50 dark:bg-slate-800/50';
    if (cellType === 'hint') return 'bg-blue-50 dark:bg-blue-900/30';
    if (cellType === 'solved') return 'bg-emerald-50 dark:bg-emerald-900/20';
    return 'bg-white dark:bg-[#1a1e2b]';
  };

  // Bold borders for 3×3 box boundaries
  const borderRight = col === 2 || col === 5 ? 'border-r-[2.5px] border-r-gray-700 dark:border-r-blue-400' : 'border-r border-r-gray-300 dark:border-r-slate-700';
  const borderBottom = row === 2 || row === 5 ? 'border-b-[2.5px] border-b-gray-700 dark:border-b-blue-400' : 'border-b border-b-gray-300 dark:border-b-slate-700';
  const borderLeft = col === 0 ? 'border-l-[2.5px] border-l-gray-700 dark:border-l-blue-400' : '';
  const borderTop = row === 0 ? 'border-t-[2.5px] border-t-gray-700 dark:border-t-blue-400' : '';
  const ringStyle = isFocused ? 'ring-2 ring-blue-400 dark:ring-blue-500 ring-inset z-10' : '';

  const animation = animateIn ? (cellType === 'hint' ? 'animate-pulse-hint' : 'animate-fill-in') : '';

  return (
    <div
      className={`relative w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 
        ${bgColor()} ${borderRight} ${borderBottom} ${borderLeft} ${borderTop} 
        ${ringStyle} transition-colors duration-200 ${animation}`}
    >
      <input
        ref={inputRef}
        type="number"
        min="1"
        max="9"
        value={value === 0 ? '' : value}
        onChange={(e) => onChange(row, col, e.target.value)}
        onFocus={() => onFocus(row, col)}
        onKeyDown={(e) => onKeyDown(e, row, col)}
        aria-label={`Cell row ${row + 1} column ${col + 1}`}
        className={`w-full h-full text-center text-lg sm:text-xl font-semibold 
          bg-transparent border-none outline-none cursor-pointer select-all
          ${textColor()} caret-blue-400`}
        style={{ caretColor: '#60a5fa' }}
      />
    </div>
  );
};

export default Cell;
