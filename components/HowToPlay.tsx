'use client';

import React, { forwardRef } from 'react';

interface HowToPlayProps {
  onClose: () => void;
}

const HowToPlay = forwardRef<HTMLDivElement, HowToPlayProps>(({ onClose }, ref) => {
  return (
    <div className="how-to-play-modal" ref={ref}>
      <div className="modal-header">
        <h2 className="modal-title">How to Play</h2>
        <div className="modal-header-buttons">
          <button className="modal-close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>

      <div className="modal-content">
        <h2 style={{ textAlign: 'left', color: 'red', fontFamily: 'Changa-Medium' }}>
          User Guide for Snakes and Ladders
        </h2>
        <p style={{ textAlign: 'left', color: 'green', fontFamily: 'Changa-Medium' }}>
          The Snakes and Ladders game is an exciting and competitive game that is played online using smart contracts on the blockchain.
          In this game, players roll dice and move across the game board in an effort to reach the finish line. This game is entirely based on chance,
          and the rules and gameplay are detailed below.
          The game is set up for the BNB Testnet. You need to acquire some TBNB (faucet) from the address (https://www.bnbchain.org/en/testnet-faucet).
          All funds you send to the game are under the complete control of the smart contract on the blockchain. No one has access to them.
          All calculations and payments are performed by the smart contract.
          The first 5,000 participants will receive special game tokens as rewards in the future.
        </p>

        <h3 style={{ textAlign: 'left', color: 'red', fontFamily: 'Changa-Medium' }}>Game Rules</h3>

        <h4 style={{ textAlign: 'left', color: 'green', fontFamily: 'Changa-Medium' }}>Joining the Game:</h4>
        <p style={{ textAlign: 'left', color: 'green', fontFamily: 'Changa-Medium' }}>
          - To join the game, each player must pay an entry fee of 0.004 BNB.<br />
          - Maximum of 1000 players allowed per game.<br />
          - Inactive players will be removed when the max limit is reached.<br />
          - A crypto wallet (e.g. MetaMask, Trust Wallet) is required.<br />
          - On mobile, open www.lottoariya.xyz in your wallet browser to play.<br />
          - At least 0.006 BNB is needed to cover entry + transaction fees.
        </p>

        <h4 style={{ textAlign: 'left', color: 'green', fontFamily: 'Changa-Medium' }}>Moving in the Game:</h4>
        <p style={{ textAlign: 'left', color: 'green', fontFamily: 'Changa-Medium' }}>
          - Dice rolls are generated using two independent systems (app and smart contract) to ensure randomness.<br />
          - No turns: all players roll individually.<br />
          - Each player can roll once every 12 hours.<br />
          - Landing on a ladder moves you up. Landing on a snake moves you down.
        </p>

        <h4 style={{ textAlign: 'left', color: 'green', fontFamily: 'Changa-Medium' }}>Antidote:</h4>
        <p style={{ textAlign: 'left', color: 'green', fontFamily: 'Changa-Medium' }}>
          - Can be purchased for 0.002 BNB.<br />
          - Max 3 antidotes per player.<br />
          - Antidotes protect against snake bites.<br />
          - If bitten 3 times without antidote, you're eliminated.
        </p>

        <h4 style={{ textAlign: 'left', color: 'green', fontFamily: 'Changa-Medium' }}>Winning:</h4>
        <p style={{ textAlign: 'left', color: 'green', fontFamily: 'Changa-Medium' }}>
          - First player to reach position 100 wins.<br />
          - Winners are grouped based on number of rolls:<br />
          - ≤9 rolls: Group 1 with special prize.<br />
          - More rolls = lower group = smaller prize.<br />
          - Max 29 rolls to win. Otherwise, you’re eliminated.
        </p>

        <h4 style={{ textAlign: 'left', color: 'green', fontFamily: 'Changa-Medium' }}>Inactive State:</h4>
        <p style={{ textAlign: 'left', color: 'green', fontFamily: 'Changa-Medium' }}>
          - No move within 12 hours = eliminated.
        </p>

        <h4 style={{ textAlign: 'left', color: 'green', fontFamily: 'Changa-Medium' }}>Prize Distribution:</h4>
        <p style={{ textAlign: 'left', color: 'green', fontFamily: 'Changa-Medium' }}>
          - Distributed among groups based on number of rolls.
        </p>

        <h4 style={{ textAlign: 'left', color: 'green', fontFamily: 'Changa-Medium' }}>Contract Management:</h4>
        <p style={{ textAlign: 'left', color: 'green', fontFamily: 'Changa-Medium' }}>
          - Only the contract owner can pause/resume the game and withdraw funds.
        </p>

        <h3 style={{ textAlign: 'left', color: 'red', fontFamily: 'Changa-Medium' }}>Important Notes</h3>
        <p style={{ textAlign: 'left', color: 'green', fontFamily: 'Changa-Medium' }}>
          - Stay active to remain in the game.<br />
          - Fair distribution among winners.<br />
          - Solo play, luck-based mechanics.<br />
          - Game of chance – affected by player count and timing.<br />
          - 18+ only.<br />
          - You're responsible for your wallet security.
        </p>
      </div>
    </div>
  );
});

export default HowToPlay;
