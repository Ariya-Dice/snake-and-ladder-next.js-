'use client';

import React, { useState, useRef, useCallback } from 'react';
import ContractManager from '../components/ContractManager';
import GameUI from '../components/GameUI';
import SocialAndNotifications from '../components/SocialAndNotifications';
import { ContractActions } from '../components/types';

export default function HomePage() {
  const [signer, setSigner] = useState<any>(null);
  const [playerInfo, setPlayerInfo] = useState({
    position: 1,
    hasAntidote: false,
    isActive: false,
    diceRollCount: 0,
    lastDiceRoll: 0,
    group: 0,
    lastActivityTime: 0,
    lastRollTime: 0,
    joinedAt: 0,
    antidoteCount: 0,
    snakeEncounters: 0,
  });

  const [destination, setDestination] = useState(1);
  const [loading, setLoading] = useState(false);
  const [activePlayers, setActivePlayers] = useState(0);
  const [events, setEvents] = useState<string[]>([]);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [walletId, setWalletId] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [prizePool, setPrizePool] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const [contractActions, setContractActions] = useState<ContractActions>({
    joinGame: null,
    rollDice: null,
    buyAntidote: null,
    handleWalletConnect: null,
  });

  const howToPlayRef = useRef<HTMLDivElement | null>(null);

  // Stable wrapper to prevent re-renders and infinite loops
  const handleSetContractActions = useCallback((actions: Record<string, any>) => {
    setContractActions({
      joinGame: actions.joinGame ?? null,
      rollDice: actions.rollDice ?? null,
      buyAntidote: actions.buyAntidote ?? null,
      handleWalletConnect: actions.handleWalletConnect ?? null,
    });
  }, []);

  return (
    <div className="app">

      <ContractManager
        signer={signer}
        setSigner={setSigner}
        fullAddress={fullAddress}
        setFullAddress={setFullAddress}
        setWalletId={setWalletId}
        setIsWalletConnected={setIsWalletConnected}
        setPlayerInfo={setPlayerInfo}
        setActivePlayers={setActivePlayers}
        setPrizePool={setPrizePool}
        setEvents={setEvents}
        setLoading={setLoading}
        setIsRolling={setIsRolling}
        setDestination={setDestination}
        playerInfo={playerInfo}
        setContractActions={handleSetContractActions}
        isWalletConnected={isWalletConnected}
      />

      <GameUI
        playerInfo={playerInfo}
        destination={destination}
        isWalletConnected={isWalletConnected}
        walletId={walletId}
        fullAddress={fullAddress}
        prizePool={prizePool}
        activePlayers={activePlayers}
        isRolling={isRolling}
        loading={loading}
        setShowHowToPlay={setShowHowToPlay}
        showHowToPlay={showHowToPlay}
        howToPlayRef={howToPlayRef}
        joinGame={contractActions.joinGame ?? undefined}
        rollDice={contractActions.rollDice ?? undefined}
        buyAntidote={contractActions.buyAntidote ?? undefined}
        handleWalletConnect={contractActions.handleWalletConnect ?? undefined}
      />

      <SocialAndNotifications events={events} />
    </div>
  );
}