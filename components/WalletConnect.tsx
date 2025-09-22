'use client';

import React, { useState, useCallback } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import { ethers, Signer } from 'ethers';
import { EthereumProvider } from '@walletconnect/ethereum-provider';

interface WalletConnectProps {
  onConnect: (account: string, signer: Signer) => Promise<void>;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onConnect }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  const projectDetails = {
    projectId: '2c04f004aaadf779b405f70334343adc',
    name: 'Snake and Ladders',
    description: 'Snake and Ladders in Blockchain',
    link: 'https://www.lottoariya.xyz',
  };

  const handleError = useCallback((err: any) => {
    let message = 'Failed to connect to wallet';
    if (err?.code === 4001) {
      message = 'You rejected the connection request';
    } else if (err?.code === -32002) {
      message = 'A connection request is already pending';
    } else if (err?.message?.includes('No provider found')) {
      message = 'No wallet detected. Please install MetaMask or Trust Wallet.';
    } else if (err?.message) {
      message = err.message;
    }

    setError(message);
    console.error('Wallet connection error:', err);
    setConnecting(false);
  }, []);

  const handleSuccess = useCallback(
    async (account: string, provider: ethers.BrowserProvider) => {
      try {
        setAccount(account);
        const signer = await provider.getSigner();
        await onConnect(account, signer);
      } catch (err) {
        handleError(err);
      } finally {
        setConnecting(false);
      }
    },
    [onConnect, handleError]
  );

  const connectWallet = useCallback(async () => {
    setError(null);
    setConnecting(true);

    try {
      const injectedProvider = await detectEthereumProvider();

      if (injectedProvider && (injectedProvider as any).isMetaMask) {
        const provider = new ethers.BrowserProvider(injectedProvider as any);
        const accounts = await (injectedProvider as any).request({
          method: 'eth_requestAccounts',
        });
        await handleSuccess(accounts[0], provider);
        return;
      }

      const wcProvider = await EthereumProvider.init({
        projectId: projectDetails.projectId,
        chains: [97], // BSC Testnet
        showQrModal: true,
        methods: ['eth_sendTransaction', 'personal_sign'],
        events: ['chainChanged', 'accountsChanged'],
        metadata: {
          name: projectDetails.name,
          description: projectDetails.description,
          url: projectDetails.link,
          icons: ['https://www.lottoariya.xyz/favicon.ico'],
        },
      });

      await wcProvider.connect();

      const provider = new ethers.BrowserProvider(wcProvider as any);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      await handleSuccess(address, provider);
    } catch (err) {
      handleError(err);
    }
  }, [handleSuccess, handleError]);

  return (
    <div>
      <button
        onClick={connectWallet}
        className="wallet-connect-button"
        disabled={connecting}
      >
        {account
          ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`
          : connecting
          ? 'Connecting...'
          : 'Connect Wallet'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default WalletConnect;