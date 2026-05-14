import React from 'react';
import Cell from './Cell';

const SudokuGrid = ({
  board,
  cellTypes,
  conflicts,
  focusedCell,
  animatedCells,
  onCellChange,
  onCellFocus,
  onKeyDown,
}) => {
  return (
    <div
      className="inline-block rounded-2xl overflow-hidden shadow-lg border-[2.5px] border-gray-700 dark:border-blue-400"
      role="grid"
      aria-label="Sudoku grid"
    >
      {board.map((row, rIdx) => (
        <div key={rIdx} className="flex" role="row">
          {row.map((value, cIdx) => {
            const key = `${rIdx},${cIdx}`;
            return (
              <Cell
                key={key}
                value={value}
                row={rIdx}
                col={cIdx}
                cellType={cellTypes[rIdx][cIdx]}
                isConflict={conflicts.has(key)}
                isFocused={focusedCell?.[0] === rIdx && focusedCell?.[1] === cIdx}
                isHighlighted={
                  focusedCell &&
                  (focusedCell[0] === rIdx ||
                    focusedCell[1] === cIdx ||
                    (Math.floor(focusedCell[0] / 3) === Math.floor(rIdx / 3) &&
                      Math.floor(focusedCell[1] / 3) === Math.floor(cIdx / 3)))
                }
                onChange={onCellChange}
                onFocus={onCellFocus}
                onKeyDown={onKeyDown}
                animateIn={animatedCells.has(key)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default SudokuGrid;
