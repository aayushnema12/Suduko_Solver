import React from 'react';
import lightImg from '../assets/left-right-light.jpg';
import darkImg from '../assets/left-right-dark.jpg';

/**
 * SideImage — a 3D flip card that shows the light-theme image on
 * the front face and the dark-theme image on the back face.
 * The card rotates 180° on its Y-axis when theme === 'dark'.
 *
 * Props:
 *   theme  – 'light' | 'dark'
 *   side   – 'left' | 'right'  (for aria-label only)
 */
const SideImage = ({ theme, side }) => {
  const isDark = theme === 'dark';

  return (
    <div
      style={{ perspective: '900px', flexShrink: 0 }}
      aria-label={`${side} decorative number image`}
    >
      {/* Flip card — rotates when theme changes */}
      <div
        className="side-image-card"
        style={{
          transform: isDark ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* FRONT face — light image */}
        <div className="side-image-face side-image-front">
          <img
            src={lightImg}
            alt="Sudoku number collage — light theme"
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '1rem' }}
            draggable={false}
          />
        </div>

        {/* BACK face — dark image */}
        <div className="side-image-face side-image-back">
          <img
            src={darkImg}
            alt="Sudoku number collage — dark theme"
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '1rem' }}
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
};

export default SideImage;
