import { Signer } from 'ethers';

// Shared types for Contract Actions
export type ContractActions = {
  joinGame: (() => void) | null;
  rollDice: (() => void) | null;
  buyAntidote: (() => void) | null;
  handleWalletConnect: ((account: string, signerObj: Signer) => Promise<void>) | null;
};

// PlayerInfo type based on usage in the app
export interface PlayerInfo {
  position: number;
  hasAntidote: boolean;
  isActive: boolean;
  diceRollCount: number;
  lastDiceRoll: number;
  group: number;
  lastActivityTime: number;
  lastRollTime: number;
  joinedAt: number;
  antidoteCount: number;
  snakeEncounters: number;
}

// Props for GameUI component
export interface GameUIProps {
  playerInfo: PlayerInfo;
  destination: number;
  isWalletConnected: boolean;
  walletId: string;
  fullAddress: string;
  prizePool: number;
  activePlayers: number;
  isRolling: boolean;
  loading: boolean;
  setShowHowToPlay: (show: boolean) => void;
  showHowToPlay: boolean;
  howToPlayRef: React.RefObject<HTMLDivElement>;
  joinGame?: () => void;
  rollDice?: () => void;
  buyAntidote?: () => void;
  handleWalletConnect?: (account: string, signerObj: Signer) => Promise<void>;
}