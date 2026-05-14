/**
 * Backtracking Sudoku solver.
 * @param {number[][]} board - 9x9 grid, 0 = empty
 * @returns {number[][] | null} solved board or null if unsolvable
 */
export function solve(board) {
  const clone = board.map((row) => [...row]);
  if (backtrack(clone)) return clone;
  return null;
}

function backtrack(board) {
  const cell = findEmpty(board);
  if (!cell) return true; // all filled

  const [row, col] = cell;
  for (let num = 1; num <= 9; num++) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;
      if (backtrack(board)) return true;
      board[row][col] = 0;
    }
  }
  return false;
}

function findEmpty(board) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) return [r, c];
    }
  }
  return null;
}

function isValid(board, row, col, num) {
  // Row check
  if (board[row].includes(num)) return false;
  // Col check
  for (let r = 0; r < 9; r++) {
    if (board[r][col] === num) return false;
  }
  // Box check
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (board[r][c] === num) return false;
    }
  }
  return true;
}

/**
 * Returns an ordered list of [row, col, value] cells that differ
 * between the original board and the solved board.
 */
export function getSolveSteps(original, solved) {
  const steps = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (original[r][c] === 0 && solved[r][c] !== 0) {
        steps.push([r, c, solved[r][c]]);
      }
    }
  }
  return steps;
}
