import React from 'react';
import '../styles/Keyboard.css';

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

const Keyboard = ({ onLetterClick, keyColors }) => {
  return (
    <div className="keyboard">
      {ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((letter) => {
            const color = keyColors?.[letter.toLowerCase()];
            return (
              <button
                key={letter}
                className={`key${color ? ` key-${color}` : ''}`}
                onClick={() => onLetterClick(letter)}
              >
                {letter}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
