import React from 'react';
import '../styles/LetterSlot.css';

const LetterSlot = ({ letter, isSelected, onClick }) => (
  <div
    className={`letter-slot${isSelected ? ' selected' : ''}`}
    onClick={onClick}
  >
    {letter}
  </div>
);

export default LetterSlot;
