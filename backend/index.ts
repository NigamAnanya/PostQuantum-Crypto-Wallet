import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { ethers } from "ethers";
import ABI from "./constants";
import type ABI from "./constants";

const app = express();

app.use(bodyParser.json());
app.use(cors());

let state = {};
let transactions = [];

async function updateState(transactions: any[]) {
  console.log(transactions);
  transactions.forEach((tx) => {
    console.log(tx.tx.to, tx.tx.value);
    if (state[tx.tx.from] == null) {
      state[tx.tx.from] = 100;
    }
    if (state[tx.tx.to] == null) {
      state[tx.tx.to] = tx.tx.value;
      state[tx.tx.from] -= tx.tx.value;
    } else {
      state[tx.tx.to] += tx.tx.value;
      state[tx.tx.from] -= tx.tx.value;
    }
  });
  transactions.length = 0;

  const provider = new ethers.JsonRpcProvider(
    "https://polygon-testnet.public.blastapi.io",
  );
  const signer = new ethers.Wallet(
    "5b1c32040fad747da544476076de2997bbb06c39353d96a4d72b1db3e60bcc82",
    provider,
  );
  const headerContract = new ethers.Contract(
    "0x1a5B95Be00fefC03161Bae09cF2C9B2f344499dA",
    ABI,
    signer,
  );

  const tx = await headerContract.setHeader(
    ethers.sha256(ethers.toUtf8Bytes(JSON.stringify(state))).toString(),
  );

  const receipt = await tx.wait();

  return receipt.hash;
}

app.get("/getState", (req, res) => {
  res.status(200).send(state);
});

app.get("/getStateHash", (req, res) => {
  res
    .status(200)
    .send(ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(state))));
});

app.post("/sendTransactions", async (req, res) => {
  const tx = req.body;
  console.log("[SEQUENCER] Transaction Received", tx);
  try {
    if (req.body.proof == true) {
      transactions.push(tx);
    }
    console.log(transactions.length);
    if (transactions.length == 3) {
      const response = await updateState(transactions);
      res.status(200).send(response);
    }
  } catch (e) {
    console.log(e);
    res.status(400).send("transaction failed");
  }
});

app.listen(3001, () => {
  console.log("Server started on port 3001");
});
