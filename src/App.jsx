import React, { useState, useCallback, useRef, useEffect } from 'react';
import SudokuGrid from './components/SudokuGrid';
import Controls from './components/Controls';
import ConflictCounter from './components/ConflictCounter';
import ResetModal from './components/ResetModal';
import ThemeToggle from './components/ThemeToggle';
import FloatingNumbers from './components/FloatingNumbers';
import logoImg from './assets/logo.png';
import { solve, getSolveSteps } from './utils/solver';
import { getConflicts } from './utils/validator';
import { SAMPLE_PUZZLE, EMPTY_BOARD } from './utils/puzzles';

// ── helpers ────────────────────────────────────────────────────────────────────
const cloneBoard = (b) => b.map((r) => [...r]);
const cloneTypes = (t) => t.map((r) => [...r]);
const emptyTypes = () => Array(9).fill(null).map(() => Array(9).fill('empty'));

// ── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  const [board, setBoard] = useState(cloneBoard(EMPTY_BOARD));
  const [cellTypes, setCellTypes] = useState(emptyTypes());
  const [history, setHistory] = useState([]); // [{board, cellTypes}]
  const [focusedCell, setFocusedCell] = useState(null);
  const [animatedCells, setAnimatedCells] = useState(new Set());
  const [conflicts, setConflicts] = useState(new Set());
  const [isSolving, setIsSolving] = useState(false);
  const [noSolution, setNoSolution] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [theme, setTheme] = useState('light');

  // ── theme effect ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  // Hint index tracks next un-filled cell from the solved board
  const hintSolvedRef = useRef(null);
  const hintIndexRef = useRef(0);

  // ── update helpers ──────────────────────────────────────────────────────────
  const pushHistory = useCallback((b, t) => {
    setHistory((h) => [...h.slice(-49), { board: cloneBoard(b), cellTypes: cloneTypes(t) }]);
  }, []);

  const applyBoard = useCallback((newBoard, newTypes, animKeys = []) => {
    setBoard(newBoard);
    setCellTypes(newTypes);
    setConflicts(getConflicts(newBoard));
    setNoSolution(false);
    if (animKeys.length) {
      const s = new Set(animKeys);
      setAnimatedCells(s);
      setTimeout(() => setAnimatedCells(new Set()), 500);
    }
  }, []);

  // ── cell change ─────────────────────────────────────────────────────────────
  const handleCellChange = useCallback(
    (row, col, rawVal) => {
      const digit = parseInt(rawVal.slice(-1), 10);
      const val = isNaN(digit) || digit < 1 || digit > 9 ? 0 : digit;

      pushHistory(board, cellTypes);

      const newBoard = cloneBoard(board);
      const newTypes = cloneTypes(cellTypes);
      newBoard[row][col] = val;
      newTypes[row][col] = val === 0 ? 'empty' : 'user';

      // Invalidate cached hint solution whenever board changes
      hintSolvedRef.current = null;
      hintIndexRef.current = 0;

      applyBoard(newBoard, newTypes, [`${row},${col}`]);
    },
    [board, cellTypes, pushHistory, applyBoard]
  );

  // ── focus / key nav ─────────────────────────────────────────────────────────
  const handleCellFocus = useCallback((row, col) => {
    setFocusedCell([row, col]);
  }, []);

  const handleKeyDown = useCallback(
    (e, row, col) => {
      const moves = {
        ArrowUp: [-1, 0],
        ArrowDown: [1, 0],
        ArrowLeft: [0, -1],
        ArrowRight: [0, 1],
      };
      if (moves[e.key]) {
        e.preventDefault();
        const [dr, dc] = moves[e.key];
        const nr = Math.max(0, Math.min(8, row + dr));
        const nc = Math.max(0, Math.min(8, col + dc));
        setFocusedCell([nr, nc]);
      }
      // Backspace / Delete clears cell
      if (e.key === 'Backspace' || e.key === 'Delete') {
        if (board[row][col] !== 0) {
          pushHistory(board, cellTypes);
          const newBoard = cloneBoard(board);
          const newTypes = cloneTypes(cellTypes);
          newBoard[row][col] = 0;
          newTypes[row][col] = 'empty';
          hintSolvedRef.current = null;
          applyBoard(newBoard, newTypes);
        }
      }
    },
    [board, cellTypes, pushHistory, applyBoard]
  );

  // ── solve ───────────────────────────────────────────────────────────────────
  const handleSolve = useCallback(() => {
    const solved = solve(board);
    if (!solved) {
      setNoSolution(true);
      return;
    }
    pushHistory(board, cellTypes);
    const steps = getSolveSteps(board, solved);
    setIsSolving(true);
    setNoSolution(false);

    const newBoard = cloneBoard(board);
    const newTypes = cloneTypes(cellTypes);
    let i = 0;

    const tick = () => {
      if (i >= steps.length) {
        setIsSolving(false);
        hintSolvedRef.current = null;
        return;
      }
      const [r, c, v] = steps[i];
      newBoard[r][c] = v;
      newTypes[r][c] = 'solved';
      const key = `${r},${c}`;
      setBoard(cloneBoard(newBoard));
      setCellTypes(cloneTypes(newTypes));
      setConflicts(getConflicts(newBoard));
      setAnimatedCells(new Set([key]));
      setTimeout(() => setAnimatedCells(new Set()), 400);
      i++;
      setTimeout(tick, 45);
    };
    tick();
  }, [board, cellTypes, pushHistory]);

  // ── hint ────────────────────────────────────────────────────────────────────
  const handleHint = useCallback(() => {
    // Build or reuse solved board
    if (!hintSolvedRef.current) {
      const solved = solve(board);
      if (!solved) {
        setNoSolution(true);
        return;
      }
      hintSolvedRef.current = solved;
      hintIndexRef.current = 0;
    }

    const solved = hintSolvedRef.current;
    // Find next empty cell in board order
    let found = false;
    for (let r = 0; r < 9 && !found; r++) {
      for (let c = 0; c < 9 && !found; c++) {
        if (board[r][c] === 0) {
          pushHistory(board, cellTypes);
          const newBoard = cloneBoard(board);
          const newTypes = cloneTypes(cellTypes);
          newBoard[r][c] = solved[r][c];
          newTypes[r][c] = 'hint';
          applyBoard(newBoard, newTypes, [`${r},${c}`]);
          setFocusedCell([r, c]);
          found = true;
        }
      }
    }
    if (!found) setNoSolution(false); // board is full
  }, [board, cellTypes, pushHistory, applyBoard]);

  // ── undo ────────────────────────────────────────────────────────────────────
  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    applyBoard(prev.board, prev.cellTypes);
    hintSolvedRef.current = null;
  }, [history, applyBoard]);

  // ── reset ───────────────────────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    setShowResetModal(false);
    setBoard(cloneBoard(EMPTY_BOARD));
    setCellTypes(emptyTypes());
    setConflicts(new Set());
    setHistory([]);
    setNoSolution(false);
    setFocusedCell(null);
    hintSolvedRef.current = null;
    hintIndexRef.current = 0;
  }, []);

  // ── load sample ─────────────────────────────────────────────────────────────
  const handleLoadSample = useCallback(() => {
    pushHistory(board, cellTypes);
    const newBoard = cloneBoard(SAMPLE_PUZZLE);
    const newTypes = newBoard.map((row) =>
      row.map((v) => (v !== 0 ? 'user' : 'empty'))
    );
    hintSolvedRef.current = null;
    applyBoard(newBoard, newTypes);
    setFocusedCell(null);
  }, [board, cellTypes, pushHistory, applyBoard]);

  // ── render ──────────────────────────────────────────────────────────────────
  const conflictCount = conflicts.size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-[#0a0a0f] dark:via-[#131722] dark:to-[#0a0a0f] flex flex-col relative transition-colors duration-300">
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

      {/* ── 3-column stretch layout ─────────────────────────────────── */}
      <div className="flex flex-row flex-1 min-h-screen">

        {/* Left floating numbers column — fills full height */}
        <div className="flex-1 relative overflow-hidden">
          <FloatingNumbers theme={theme} />
        </div>

        {/* Center column — all app content, no width restriction beyond content */}
        <div className="flex flex-col items-center justify-start gap-6 py-6 px-4 pb-10">

          {/* Header */}
          <header className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md ring-1 ring-black/5 dark:ring-white/10 flex items-center justify-center bg-slate-900">
                <img src={logoImg} alt="Sudoku Solver Logo" className="w-full h-full object-cover" draggable={false} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white tracking-tight">
                Sudoku Solver
              </h1>
            </div>
            <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">Enter your puzzle, then click Solve</p>
          </header>

          {/* Hint badge */}
          <div className="text-xs text-gray-400 dark:text-gray-500 bg-white/70 dark:bg-slate-800/70 border border-gray-100 dark:border-slate-700 rounded-full px-3 py-1 shadow-sm">
            💡 Use arrow keys to navigate · Tab to move forward · Backspace to clear
          </div>

          {/* Grid — untouched */}
          <SudokuGrid
            board={board}
            cellTypes={cellTypes}
            conflicts={conflicts}
            focusedCell={focusedCell}
            animatedCells={animatedCells}
            onCellChange={handleCellChange}
            onCellFocus={handleCellFocus}
            onKeyDown={handleKeyDown}
          />

          {/* Conflict counter */}
          <ConflictCounter count={conflictCount} />

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-white dark:bg-[#1a1e2b] border border-gray-300 dark:border-slate-600 inline-block" />
              You
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50 inline-block" />
              Hint
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 inline-block" />
              Solved
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-rose-100 dark:bg-rose-900/30 border border-red-200 dark:border-red-900/50 inline-block" />
              Conflict
            </span>
          </div>

          {/* Controls */}
          <div className="w-full max-w-md bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-gray-100 dark:border-slate-700 rounded-2xl shadow-sm p-4">
            <Controls
              onSolve={handleSolve}
              onHint={handleHint}
              onUndo={handleUndo}
              onReset={() => setShowResetModal(true)}
              onLoadSample={handleLoadSample}
              canUndo={history.length > 0}
              isSolving={isSolving}
              noSolution={noSolution}
            />
          </div>

          {/* Footer */}
          <footer className="mt-6 flex flex-col items-center gap-1 opacity-80 hover:opacity-100 transition-opacity duration-300">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Built by <span className="text-blue-600 dark:text-blue-400">Aayush Nema</span>
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              © {new Date().getFullYear()} Sudoku Solver. All rights reserved.
            </p>
          </footer>
        </div>

        {/* Right floating numbers column — fills full height */}
        <div className="flex-1 relative overflow-hidden">
          <FloatingNumbers theme={theme} />
        </div>

      </div>

      {/* Reset modal */}
      {showResetModal && (

        <ResetModal
          onConfirm={handleReset}
          onCancel={() => setShowResetModal(false)}
        />
      )}
    </div>
  );
}
