'use client';

import React, { useEffect, useRef, useState } from 'react';
import '../styles/DiceAnimation.css';

interface DiceAnimationProps {
  onRollComplete: (value: number) => void;
  isRolling: boolean;
  lastDiceRoll: number;
}

const DiceAnimation: React.FC<DiceAnimationProps> = ({ onRollComplete, isRolling, lastDiceRoll }) => {
  const diceRef = useRef<HTMLDivElement>(null);
  const outputDivRef = useRef<HTMLDivElement>(null);
  const [diceValue, setDiceValue] = useState(lastDiceRoll);

  useEffect(() => {
    if (isRolling) {
      const interval = setInterval(() => {
        const randomSide = Math.floor(Math.random() * 6) + 1;
        setDiceValue(randomSide);
      }, 300);

      return () => clearInterval(interval);
    } else {
      setDiceValue(lastDiceRoll);
      outputDivRef.current?.classList.remove('hide');
      outputDivRef.current?.classList.add('reveal');
      onRollComplete(lastDiceRoll);
    }
  }, [isRolling, lastDiceRoll, onRollComplete]);

  return (
    <div className="dice-container">
      <div id="dice" ref={diceRef}>
        {[1, 2, 3, 4, 5, 6].map((side) => (
          <div key={side} className={`sides side-${side}`}>
            <span className="dice-symbol">{diceValue}</span>
          </div>
        ))}
      </div>
      <div id="diceResult" ref={outputDivRef} className="hide">{diceValue}</div>
    </div>
  );
};

export default DiceAnimation;
