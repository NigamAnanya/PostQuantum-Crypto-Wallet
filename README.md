PostQuantum-Crypto-Wallet
GitHub - https://github.com/NigamAnanya/PostQuantum-Crypto-Wallet

Demo Vedio - https://www.youtube.com/watch?v=V4BWTtBrJkY


The problem Quantum Safe wallets with Pessimistic Sequencer solves

Why ?

The current crypto wallets are based on secp256k1 curve to generate key-pairs, but they are not quantum resistant. Usually using the curve we generate a private key, from which we generate a public key.

Private and Public key together is called Key Pair

Quick analogy

•	Private Key → Bank acc password → Obv you dont share with anyone → Used to approve transactions.

•	Public key → Bank acc number → Can be made public and shared to receive/send transactions.

Now with the current Key pair generation, there is a problem :

With current computers, Public key can be generated from a Private key which is safe and reverse is not possible. How ever with quantum computing, we can get private keys from public keys which is a threat since, i can now steal money from others wallets.

This is like, i give you my Bank acc number and you can figure out my Bank acc password and steal money from it.

Solution

•	Add quantum safe cryptography to generate key-pair.
•	Have a pessimistic sequencer to validate the signatures and send it to Ethereum.

Proposed Architecture

•	The wallet is generated using superfalcon library which can generate key-pairs which are quantum resistant.

•	For the demo, a dummy L2 chain is created where the state is account:balance and state transition function is just sending/receiving tokens.

•	A transaction is signed by the quantum proof wallet and the state change is verified by a server (sequencer in this case).

•	Once verified, the state root hash is updated and posted to Polygon or any other L1 of choice.

•	Advantage is that since root hash is stored, the last state can always be recovered.

Challenges I ran into

•	Figuring out a key-pair generating package which worked took up a long time, and designing how to make it work with existing packages like ethers.

•	Moreover proofs could be leveraged using ZK but shortage of time and resources couldnt let me explore that option
