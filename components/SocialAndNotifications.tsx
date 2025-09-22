'use client';

import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';

type SocialAndNotificationsProps = {
  events: string[];
  loading?: boolean;
};

const donationAddress = '0xC776f5fDB11eC7897cbc18a4005390eb1D7DeC62';

const SocialAndNotifications: React.FC<SocialAndNotificationsProps> = ({ events, loading = false }) => {
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(donationAddress)
      .then(() => toast.success('Donation address copied to clipboard!'))
      .catch((err) => {
        console.error('Failed to copy: ', err);
        toast.error('Failed to copy donation address.');
      });
  };

  return (
    <>
      <div
        className="social-buttons"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '20px',
        }}
      >

        <a
          href="https://t.me/lottoariyabot"
          target="_blank"
          rel="noopener noreferrer"
          className="social-button"
        >
          <Image src="/assets/telegram.png" alt="Telegram" className="social-icon" width={30} height={30} />
          <div className="tooltip">Telegram</div>
        </a>

        <a
          href="https://x.com/AriyaDice"
          target="_blank"
          rel="noopener noreferrer"
          className="social-button"
        >
          <Image src="/assets/socialx.png" alt="X" className="social-icon" width={30} height={30} />
          <div className="tooltip">X</div>
        </a>

        <div
          className="donate-button"
          style={{ position: 'relative', marginLeft: '10px' }}
          onClick={copyToClipboard}
        >
          <Image
            src="/assets/redforg.svg"
            alt="Donate"
            className="donate-icon"
            width={30}
            height={30}
            style={{ cursor: 'pointer' }}
          />
          <div className="donate-tooltip">Enjoy the game? Buy me a Mosquito!</div>
        </div>
      </div>

      <div className="event-log" style={{ padding: '1rem', textAlign: 'center' }}>
        <h5>Event Log</h5>
        {events.length > 0 ? (
          events.map((event, index) => (
            <p key={index} style={{ fontSize: '0.9rem', color: '#555' }}>
              {event}
            </p>
          ))
        ) : (
          <p>No recent events</p>
        )}
      </div>

      {loading && (
        <div className="loading-container" style={{ textAlign: 'center', marginTop: '20px' }}>
          <Image src="/assets/hand.gif" alt="Loading" className="loading-gif" width={60} height={60} />
          <p className="loading-text">The frog goes ribbit.</p>
        </div>
      )}

      <ToastContainer />
    </>
  );
};

export default SocialAndNotifications;
