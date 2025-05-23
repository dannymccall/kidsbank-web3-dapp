# 🏦 Kids Blockchain Bank

A decentralized banking system built for kids to help them learn the value of money in a secure and transparent way. This app allows guardians to create wallets for kids, deposit funds, and monitor transactions — all powered by blockchain.

## 🚀 Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/)
- **Smart Contracts**: [Solidity](https://soliditylang.org/) using [Truffle](https://trufflesuite.com/)
- **Blockchain Interaction**: [Web3.js](https://web3js.readthedocs.io/)

---

## 🎯 Features

- 🧒 **Child Wallets**: Guardians can create wallets for kids
- 💰 **Deposit System**: Send ETH to children's accounts
- 📊 **Balance & History Tracking**: View transaction history and balances
- 🔐 **Blockchain Security**: All actions are recorded immutably on-chain
- 🎓 **Learning by Doing**: Kid-friendly design to introduce blockchain finance
- 🖼️ *(Optional)* **Avatar/Image Upload**: Store files via IPFS using Pinata

---

## 📂 Folder Structure

./ # Smart contracts (Solidity + Truffle)
/app # Next.js pages
/app/components # React UI components
/utils # Web3 
/public # Static assets

## ⚙️ Setup Instructions

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/kids-blockchain-bank.git
   cd kids-blockchain-bank

   Install development dependencies
    npm install
    Install backend (Truffle) dependencies


   Install frontend dependencies
    cd /frontend && npm install
    npm install


    Compile & deploy contracts
    cd ..

    truffle compile
    truffle migrate --network <your_network>


    Run the frontend
    cd /frontend && npm run dev