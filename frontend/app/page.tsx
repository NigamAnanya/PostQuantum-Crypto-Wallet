"use client";
import Image from "next/image";
import styles from "./page.module.css";
import React, { useEffect, useState } from "react";
import { superFalcon } from "superfalcon";
import axios from "axios";

export default function Home() {
  const [publicKey, setPublicKey] = React.useState<String>("");
  const [privateKey, setPrivateKey] = React.useState<Uint8Array>();
  const [receiverAddress, setReceiverAddress] = React.useState("");
  const [transferAmount, setTransferAmount] = React.useState(0);
  const [currentState, setCurrentState] = React.useState({});
  const [currentStateHash, setCurrentStateHash] = React.useState("");
  const [txHash, setTxHash] = useState("");

  useEffect(() => {
    getCurrentState();
    getCurrentStateHash();
  });

  const generateWallet = async () => {
    const keyPair = await superFalcon.keyPair();
    setPublicKey(Buffer.from(keyPair.publicKey).toString("hex"));
    setPrivateKey(keyPair.privateKey);
  };

  const sendTransaction = async () => {
    const tx = {
      from: publicKey,
      to: receiverAddress,
      value: transferAmount,
    };

    const signature = await superFalcon.signDetached(
      JSON.stringify(tx),
      privateKey,
    );

    console.log(signature);

    const res = await axios.post("http://localhost:3001/sendTransactions", {
      proof: true,
      tx,
    });

    console.log(res.data);
    setTxHash(res.data);
    console.log(txHash);
  };

  const getCurrentState = async () => {
    const response = await axios.get("http://localhost:3001/getState");
    setCurrentState(response.data);
  };

  const getCurrentStateHash = async () => {
    const response = await axios.get("http://localhost:3001/getStateHash");
    setCurrentStateHash(response.data);
  };

  return (
    <main className={styles.container}>
      <div className={styles.leftColumn}>
        <div className={styles.headerRow}>Blockchain Status</div>
        <div className={styles.currentStateRow}>
          Latest Block Hash: {txHash}
          <br />
          <br />
          Current State Hash: {currentStateHash}
        </div>
        <div className={styles.headerRow}>Current State</div>
        <div className={styles.currentStateRow}>
          Current State:{" "}
          {
            <ul>
              {Object.entries(currentState).map(([key, value]) => (
                <li
                  key={key}
                >{`${key.slice(0, 5)}...${key.slice(-5)} : ${value}`}</li>
              ))}
            </ul>
          }
          <br />
          <br />
        </div>
      </div>
      <div className={styles.rightColumn}>
        <div className={styles.headerRow}>Post-Quantum safe wallet</div>
        <div className={styles.walletInfo}>
          <div>
            <label>
              {publicKey === ""
                ? "Click on Generate Button to generate Wallet"
                : `${publicKey.slice(0, 5)}...${publicKey.slice(-5)}`}
            </label>
          </div>
          <button className={styles.button} onClick={generateWallet}>
            Generate Wallet
          </button>
          <input
            className={styles.input}
            onChange={(e) => setReceiverAddress(e.target.value)}
            placeholder="Receiver Address"
          />
          <input
            className={styles.input}
            onChange={(e) => setTransferAmount(Number(e.target.value))}
            placeholder="Amount"
          />
          <button className={styles.button} onClick={sendTransaction}>
            Transfer Token
          </button>
        </div>
      </div>
    </main>
  );
}
