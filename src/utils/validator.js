/**
 * Returns a Set of "r,c" keys for all conflicting cells.
 * A cell conflicts if the same number appears in its row, column, or 3×3 box.
 */
export function getConflicts(board) {
  const conflicts = new Set();

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const val = board[r][c];
      if (val === 0) continue;

      // Check row
      for (let cc = 0; cc < 9; cc++) {
        if (cc !== c && board[r][cc] === val) {
          conflicts.add(`${r},${c}`);
          conflicts.add(`${r},${cc}`);
        }
      }
      // Check column
      for (let rr = 0; rr < 9; rr++) {
        if (rr !== r && board[rr][c] === val) {
          conflicts.add(`${r},${c}`);
          conflicts.add(`${rr},${c}`);
        }
      }
      // Check box
      const boxRow = Math.floor(r / 3) * 3;
      const boxCol = Math.floor(c / 3) * 3;
      for (let rr = boxRow; rr < boxRow + 3; rr++) {
        for (let cc = boxCol; cc < boxCol + 3; cc++) {
          if ((rr !== r || cc !== c) && board[rr][cc] === val) {
            conflicts.add(`${r},${c}`);
            conflicts.add(`${rr},${cc}`);
          }
        }
      }
    }
  }
  return conflicts;
}
