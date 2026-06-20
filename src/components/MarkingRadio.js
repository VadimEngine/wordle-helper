import React from 'react';
import '../styles/MarkingRadio.css';

const MarkingRadio = ({ color, selected, onChange }) => {
  return (
    <button
      className={`marking-radio swatch-${color}${selected ? ' selected' : ''}`}
      onClick={onChange}
      aria-label={color}
      title={color}
    />
  );
};

export default MarkingRadio;
