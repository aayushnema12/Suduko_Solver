import React, { useMemo } from 'react';

/**
 * FloatingNumbers — fills its parent container with 18 continuously
 * rising digit particles. Colors adapt to the current theme.
 * Parent must be `position: relative` with a defined height.
 *
 * Props:
 *   theme – 'light' | 'dark'
 */
const FloatingNumbers = ({ theme }) => {
  const isDark = theme === 'dark';

  // Deterministic pseudo-random particles — stable across re-renders.
  // Negative animation-delay starts particles mid-flight so the panel
  // is populated immediately on load instead of all rising at once.
  const particles = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => {
        const digit = ((i * 4 + 3) % 9) + 1;       // 1-9, varied
        const x = 4 + ((i * 31 + 17) % 88);         // 4-92% from left
        const duration = 6 + (i % 8);               // 6-13s per cycle
        const delay = -(i * 1.1);                   // stagger, already mid-flight
        const size = 12 + (i % 7) * 9;             // 12, 21, 30, 39, 48, 57, 66 px
        const alpha = 0.10 + (i % 8) * 0.055;      // 0.10 – 0.485
        return { id: i, digit, x, duration, delay, size, alpha };
      }),
    []
  );

  const containerStyle = {
    // Fills the parent div completely
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
    // Subtle background tint
    background: isDark
      ? 'linear-gradient(180deg, rgba(15,23,42,0.45) 0%, rgba(8,12,28,0.60) 100%)'
      : 'linear-gradient(180deg, rgba(241,245,249,0.55) 0%, rgba(226,232,240,0.65) 100%)',
    backdropFilter: 'blur(2px)',
    transition: 'background 0.3s',
  };

  return (
    <div style={containerStyle} aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            bottom: '-80px',
            fontSize: `${p.size}px`,
            fontWeight: 700,
            fontFamily: "'Inter', sans-serif",
            color: isDark
              ? `rgba(147, 197, 253, ${p.alpha})`   // blue-300 tint
              : `rgba(71, 85, 105, ${p.alpha})`,     // slate-600 tint
            lineHeight: 1,
            userSelect: 'none',
            animation: `floatUp ${p.duration}s ${p.delay}s infinite linear`,
            willChange: 'transform, opacity',
          }}
        >
          {p.digit}
        </span>
      ))}
    </div>
  );
};

export default FloatingNumbers;
