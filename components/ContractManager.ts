'use client';

import React, { useEffect, useCallback } from 'react';
import { ethers, Signer } from 'ethers';
import DiceRollingGameABI from '../contracts/SnakeGame.json';
import { toast } from 'react-toastify';
import { ContractActions } from '../components/types';

const contractAddress = '0xDa14e06ed17CEE5C0c3DD47D2ea172b884386789';

interface ContractManagerProps {
  signer: any;
  setSigner: (signer: any) => void;
  fullAddress: string;
  setFullAddress: (address: string) => void;
  setWalletId: (id: string) => void;
  
  setIsWalletConnected: (connected: boolean) => void;
  setPlayerInfo: (info: any) => void;
  setActivePlayers: (count: number) => void;
  setPrizePool: (pool: number) => void;
  setEvents: React.Dispatch<React.SetStateAction<string[]>>;
  setLoading: (state: boolean) => void;
  setIsRolling: (state: boolean) => void;
  setDestination: (pos: number) => void;
  playerInfo: any;
  setContractActions: (actions: ContractActions) => void;
  isWalletConnected: boolean;
}

export default function ContractManager({
  signer,
  setSigner,
  fullAddress,
  setFullAddress,
  setWalletId,
  setIsWalletConnected,
  setPlayerInfo,
  setActivePlayers,
  setPrizePool,
  setEvents,
  setLoading,
  setIsRolling,
  setDestination,
  playerInfo,
  setContractActions,
  isWalletConnected,
}: ContractManagerProps) {

  const appendEventMessage = useCallback(
    (msg: string) =>
      setEvents((prev: string[]) => [...prev, msg].slice(-2)),
    [setEvents]
  );

  const handleErrorMessage = useCallback((error: any) => {
    let errorMessage = 'Unknown error.';
    const reason = error?.data?.message?.match(/\"([^\"]+)\"/)?.[1];

    const knownErrors: Record<string, string> = {
      'Contract is paused': 'The contract is currently paused.',
      'Only EOA can call this function': 'Only externally owned accounts can call this function.',
      'Invalid entry fee': 'The entry fee is invalid.',
      'Max players': 'The maximum number of players has been reached.',
      'Already active': 'You are already an active player.',
      'Inactive player': 'You cannot roll the dice because you are inactive.',
      'Already finished': 'The game has already finished.',
      'Cannot move to that position': 'Invalid move. Roll again later.',
      'Invalid antidote fee': 'The antidote fee is invalid.',
      'Max antidotes': 'Maximum antidotes reached.',
      'No prize available': 'No prize is available.',
    };

    if (reason && knownErrors[reason]) errorMessage = knownErrors[reason];
    else if (reason) errorMessage = reason;
    else if (error?.reason) errorMessage = error.reason;
    else if (error?.message) errorMessage = error.message;

    toast.error(errorMessage);
  }, []);

  const getPlayerDetails = useCallback(
    async (playerAddress: string) => {
      console.log('getPlayerDetails called with:', { playerAddress, signer: !!signer });
      
      if (!signer || !playerAddress || !ethers.isAddress(playerAddress)) {
        if (isWalletConnected) toast.error('Invalid wallet address.');
        return;
      }

      try {
        console.log('Creating contract instance...');
        const contract = new ethers.Contract(contractAddress, DiceRollingGameABI, signer);
        
        console.log('Calling getPlayerStatus...');
        const data = await contract.getPlayerStatus(playerAddress);
        console.log('Player data received:', data);
        
        const [
          position,
          hasAntidote,
          isActive,
          diceRollCount,
          lastDiceRoll,
          group,
          lastActivityTime,
          lastRollTime,
          joinedAt,
          antidoteCount,
          snakeEncounters,
        ] = data;

        const newPlayerInfo = {
          position: Number(position),
          hasAntidote,
          isActive,
          diceRollCount: Number(diceRollCount),
          lastDiceRoll: Number(lastDiceRoll),
          group: Number(group),
          lastActivityTime: Number(lastActivityTime),
          lastRollTime: Number(lastRollTime),
          joinedAt: Number(joinedAt),
          antidoteCount: Number(antidoteCount),
          snakeEncounters: Number(snakeEncounters),
        };

        console.log('Setting player info:', newPlayerInfo);
        setPlayerInfo(newPlayerInfo);
        setDestination(Number(position));
      } catch (error: any) {
        console.error('Failed to fetch player details:', error);
        toast.error('Failed to load player details.');
      }
    },
    [signer, setPlayerInfo, setDestination, isWalletConnected]
  );

  const fetchActivePlayers = useCallback(async () => {
    if (!signer) return;
    try {
      const contract = new ethers.Contract(contractAddress, DiceRollingGameABI, signer);
      const count = await contract.getActivePlayers();
      setActivePlayers(Number(count));
    } catch {
      toast.error('Error fetching active players.');
    }
  }, [signer, setActivePlayers]);

  const fetchGameData = useCallback(async () => {
    if (!signer) return;
    try {
      const contract = new ethers.Contract(contractAddress, DiceRollingGameABI, signer);
      const [pool] = await contract.getPrizePoolAndWinners();
      setPrizePool(Number(ethers.formatUnits(pool, 18)));
    } catch {
      toast.error('Failed to load game data.');
    }
  }, [signer, setPrizePool]);

  const handleWalletConnect = useCallback(
    async (account: string, signerObj: Signer) => {
      try {
        console.log('handleWalletConnect called with:', { account, signerObj: !!signerObj });
        
        if (!account || !signerObj) throw new Error('Invalid wallet');
        if (!signerObj.provider) throw new Error('Provider not available');

        console.log('Setting wallet states...');
        setSigner(signerObj);
        setWalletId(account.substring(0, 6));
        setFullAddress(account);
        setIsWalletConnected(true);
        
        console.log('Wallet states set, checking network...');

        // Get network info using getNetwork() - more reliable
        const network = await signerObj.provider.getNetwork();
        console.log('Current network:', network);
        
        if (Number(network.chainId) !== 97) {
          console.log('Switching to BSC Testnet...');
          try {
            // Cast to any to access send method for wallet operations
            const provider = signerObj.provider as any;
            await provider.send('wallet_switchEthereumChain', [{ chainId: '0x61' }]);
          } catch (err: any) {
            if (err.code === 4902) {
              const provider = signerObj.provider as any;
              await provider.send('wallet_addEthereumChain', [{
                chainId: '0x61',
                chainName: 'Binance Smart Chain Testnet',
                rpcUrls: ['https://bsc-testnet-rpc.publicnode.com'],
                nativeCurrency: { name: 'BNB', symbol: 'tBNB', decimals: 18 },
                blockExplorerUrls: ['https://testnet.bscscan.com/'],
              }]);
            } else throw err;
          }
        }

        console.log('Fetching player details...');
        toast.success('Wallet connected!');
        await getPlayerDetails(account);
        await fetchActivePlayers();
        await fetchGameData();
        
        console.log('Wallet connection completed successfully');
      } catch (error: any) {
        console.error('Error in handleWalletConnect:', error);
        toast.error('Error connecting wallet: ' + (error.message || 'Unknown error'));
        setIsWalletConnected(false);
        setSigner(null);
        setWalletId('');
        setFullAddress('');
      }
    },
    [setSigner, setWalletId, setFullAddress, setIsWalletConnected, getPlayerDetails, fetchActivePlayers, fetchGameData]
  );

  // Implement joinGame function
  const joinGame = useCallback(async () => {
    if (!signer) return;
    setLoading(true);
    try {
      const contract = new ethers.Contract(contractAddress, DiceRollingGameABI, signer);
      const entryFee = ethers.parseEther("0.004"); // مطابق با قرارداد: 0.004 ether
      const tx = await contract.joinGame({ value: entryFee });
      await tx.wait();
      toast.success('Successfully joined the game!');
      await getPlayerDetails(fullAddress);
      await fetchActivePlayers();
      await fetchGameData();
      appendEventMessage('Joined the game!');
    } catch (error: any) {
      handleErrorMessage(error);
    } finally {
      setLoading(false);
    }
  }, [signer, fullAddress, getPlayerDetails, fetchActivePlayers, fetchGameData, appendEventMessage, handleErrorMessage, setLoading]);

  // Implement rollDice function - اصلاح شده برای قرارداد
  const rollDice = useCallback(async () => {
    if (!signer || !playerInfo.isActive) {
      toast.warn('You must be an active player to roll the dice.');
      return;
    }
    setLoading(true);
    setIsRolling(true);
    try {
      const contract = new ethers.Contract(contractAddress, DiceRollingGameABI, signer);
      // تولید seed تصادفی برای قرارداد
      const userProvidedSeed = Math.floor(Math.random() * 1000000);
      const tx = await contract.rollDice(userProvidedSeed);
      await tx.wait();
      toast.success('Dice rolled successfully!');
      await getPlayerDetails(fullAddress);
      appendEventMessage(`Rolled dice: ${playerInfo.lastDiceRoll}`);
    } catch (error: any) {
      handleErrorMessage(error);
    } finally {
      setLoading(false);
      setIsRolling(false);
    }
  }, [signer, playerInfo, fullAddress, getPlayerDetails, appendEventMessage, handleErrorMessage, setLoading, setIsRolling]);

  // Implement buyAntidote function - اصلاح شده با debug
  const buyAntidote = useCallback(async () => {
    console.log('buyAntidote called', { signer: !!signer, isActive: playerInfo.isActive });
    
    if (!signer) {
      toast.error('Wallet not connected');
      return;
    }
    
    if (!playerInfo.isActive) {
      toast.warn('You must be an active player to buy antidote. Please join the game first.');
      return;
    }
    
    setLoading(true);
    try {
      const contract = new ethers.Contract(contractAddress, DiceRollingGameABI, signer);
      const antidoteFee = ethers.parseEther("0.002"); // مطابق با قرارداد: 0.002 ether
      
      console.log('Sending buyAntidote transaction with fee:', antidoteFee.toString());
      const tx = await contract.buyAntidote({ value: antidoteFee });
      console.log('Transaction sent:', tx.hash);
      
      await tx.wait();
      console.log('Transaction confirmed');
      
      toast.success('Antidote purchased successfully!');
      await getPlayerDetails(fullAddress);
      appendEventMessage('Bought an antidote!');
    } catch (error: any) {
      console.error('Error buying antidote:', error);
      handleErrorMessage(error);
    } finally {
      setLoading(false);
    }
  }, [signer, playerInfo.isActive, fullAddress, getPlayerDetails, appendEventMessage, handleErrorMessage, setLoading]);

  useEffect(() => {
    // Set the actual functions in contractActions
    setContractActions({
      joinGame,
      rollDice,
      buyAntidote,
      handleWalletConnect,
    });
  }, [joinGame, rollDice, buyAntidote, handleWalletConnect, setContractActions]);

  useEffect(() => {
    if (signer && fullAddress && ethers.isAddress(fullAddress)) {
      (async () => {
        await getPlayerDetails(fullAddress);
        await fetchActivePlayers();
        await fetchGameData();
      })();
    }
  }, [signer, fullAddress, getPlayerDetails, fetchActivePlayers, fetchGameData]);

  return null;
}