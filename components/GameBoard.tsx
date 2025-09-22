'use client';

import React, { useState, useEffect } from 'react';
import '../styles/GameBoard.css';

const rows = 10;
const columns = 10;

interface SquareProps {
  position: number;
  playerPosition: number;
  scale: number;
}

const Square: React.FC<SquareProps> = React.memo(({ position, playerPosition, scale }) => {
  const isPlayerHere = playerPosition === position;

  return (
    <div className="square">
      {isPlayerHere && (
        <img
          src="/assets/redfrog.svg"
          alt={`Frog at position ${position}`}
          className="player-image"
          style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
          onError={() => console.error(`Failed to load image at position ${position}`)}
        />
      )}
      <span className="square-number">{position}</span>
    </div>
  );
});

interface GameBoardProps {
  playerPosition: number;
  destination: number;
  isWalletConnected: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ playerPosition, destination, isWalletConnected }) => {
  const [currentPosition, setCurrentPosition] = useState(1);
  const [animating, setAnimating] = useState(false);
  const [scale, setScale] = useState(1);
  const [initialConnection, setInitialConnection] = useState(true);

  useEffect(() => {
    if (isWalletConnected && initialConnection && playerPosition !== currentPosition) {
      setCurrentPosition(playerPosition);
      setInitialConnection(false);
    }
  }, [isWalletConnected, playerPosition, currentPosition, initialConnection]);

  useEffect(() => {
    if (!initialConnection && playerPosition !== destination && !animating) {
      setAnimating(true);
      animateMove(currentPosition, destination);
    }
  }, [playerPosition, destination, animating, currentPosition, initialConnection]);

  const animateMove = (start: number, end: number) => {
    const startTime = performance.now();
    const distance = Math.abs(end - start);
    const duration = distance * 500;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const currentPos = Math.round(start + (end - start) * progress);

      const midpoint = duration / 2;
      let currentScale;
      if (elapsed < midpoint) {
        currentScale = 1 + 0.5 * (elapsed / midpoint);
      } else {
        currentScale = 1.5 - 0.5 * ((elapsed - midpoint) / midpoint);
      }

      setCurrentPosition(currentPos);
      setScale(currentScale);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setAnimating(false);
        setCurrentPosition(end);
        setScale(1);
      }
    };

    requestAnimationFrame(animate);
  };

  const renderRow = (row: number) => {
    return [...Array(columns)].map((_, col) => {
      const visualRow = rows - 1 - row;
      const basePosition = (rows - 1 - visualRow) * columns;
      const position = basePosition + (visualRow % 2 === 0 ? columns - col : col + 1);
      return (
        <Square
          key={position}
          position={position}
          playerPosition={currentPosition}
          scale={scale}
        />
      );
    });
  };

  return (
    <div className="board">
      {[...Array(rows)].map((_, row) => (
        <React.Fragment key={row}>{renderRow(rows - 1 - row)}</React.Fragment>
      ))}
    </div>
  );
};

export default React.memo(GameBoard);
