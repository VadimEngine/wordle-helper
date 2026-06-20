import React, { useState, useEffect, useCallback, useMemo } from 'react';
import '../styles/WordleHelper.css';
import LetterSlot from './LetterSlot';
import MarkingRadio from './MarkingRadio';
import Keyboard from './Keyboard';
import wordleWords from '../data/wordle1.json';

const SLOT_COUNT = 5;

const WordleHelper = () => {
  const [slots, setSlots] = useState(Array(SLOT_COUNT).fill(''));
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [keyMarks, setKeyMarks] = useState({});
  const [showCount, setShowCount] = useState(false);
  const [wordsOpen, setWordsOpen] = useState(false);

  const handleLetterInput = useCallback((letter) => {
    setSlots(prev => {
      const next = [...prev];
      next[selectedSlot] = letter.toUpperCase();
      return next;
    });
  }, [selectedSlot]);

  const handleKeyMark = useCallback((letter) => {
    const key = letter.toLowerCase();
    setKeyMarks(prev => {
      if (prev[key] === selectedColor) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return { ...prev, [key]: selectedColor };
    });
  }, [selectedColor]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      const letter = e.key.toUpperCase();
      if (!/^[A-Z]$/.test(letter)) return;
      if (selectedColor !== null) {
        handleKeyMark(letter);
      } else {
        handleLetterInput(letter);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedColor, handleKeyMark, handleLetterInput]);

  const handleSlotClick = (index) => {
    if (slots[index]) {
      setSlots(prev => {
        const next = [...prev];
        next[index] = '';
        return next;
      });
    }
    setSelectedSlot(index);
  };

  const handleColorChange = (color) => {
    setSelectedColor(prev => (prev === color ? null : color));
  };

  const handleKeyClick = (letter) => {
    if (selectedColor !== null) {
      handleKeyMark(letter);
    } else {
      handleLetterInput(letter);
    }
  };

  const isValidWord = useMemo(() => {
    if (slots.some(l => !l)) return false;
    return wordleWords.includes(slots.join('').toLowerCase());
  }, [slots]);

  const matchingWords = useMemo(() => {
    if (!showCount) return [];

    const slotLetters = new Set(slots.filter(Boolean).map(l => l.toLowerCase()));

    return wordleWords.filter(word => {
      const w = word.toLowerCase();

      for (let i = 0; i < SLOT_COUNT; i++) {
        const letter = slots[i]?.toLowerCase();
        if (!letter) continue;
        const mark = keyMarks[letter];
        if (mark === 'yellow') {
          if (!w.includes(letter) || w[i] === letter) return false;
        } else {
          if (w[i] !== letter) return false;
        }
      }

      for (const [letter, color] of Object.entries(keyMarks)) {
        if (slotLetters.has(letter)) continue;
        if (color === 'dark' && w.includes(letter)) return false;
        if ((color === 'yellow' || color === 'green') && !w.includes(letter)) return false;
      }

      return true;
    });
  }, [slots, keyMarks, showCount]);

  // Close word list when show count is unchecked
  useEffect(() => {
    if (!showCount) setWordsOpen(false);
  }, [showCount]);

  return (
    <div className="wordle-helper">
      <header className="app-header">
        <h1>WORDLE HELPER</h1>
      </header>

      <div className={`slots-row${isValidWord ? ' valid-word' : ''}`}>
        {slots.map((letter, index) => (
          <LetterSlot
            key={index}
            letter={letter}
            isSelected={selectedSlot === index && selectedColor === null}
            onClick={() => handleSlotClick(index)}
          />
        ))}
      </div>

      <div className="marking-controls">
        <div className="marking-radios">
          <MarkingRadio color="dark"   selected={selectedColor === 'dark'}   onChange={() => handleColorChange('dark')} />
          <MarkingRadio color="yellow" selected={selectedColor === 'yellow'} onChange={() => handleColorChange('yellow')} />
          <MarkingRadio color="green"  selected={selectedColor === 'green'}  onChange={() => handleColorChange('green')} />
        </div>

        <div className="count-row">
          <label className="show-count-label">
            <input
              type="checkbox"
              checked={showCount}
              onChange={(e) => setShowCount(e.target.checked)}
            />
            <span>Show Count</span>
          </label>
          {showCount && (
            <button
              className="count-badge"
              onClick={() => setWordsOpen(o => !o)}
              title={wordsOpen ? 'Hide words' : 'Show words'}
            >
              {matchingWords.length}
              <span className="count-arrow">{wordsOpen ? '▲' : '▼'}</span>
            </button>
          )}
        </div>

        {wordsOpen && (
          <div className="word-list">
            {matchingWords.length === 0
              ? <span className="word-list-empty">No matches</span>
              : matchingWords.map(w => (
                  <span key={w} className="word-chip">{w}</span>
                ))
            }
          </div>
        )}
      </div>

      <Keyboard onLetterClick={handleKeyClick} keyColors={keyMarks} />
    </div>
  );
};

export default WordleHelper;
