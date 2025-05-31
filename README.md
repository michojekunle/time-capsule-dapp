# TimeCapsule dApp - Rootstock Tutorial

A modern time capsule dApp built on Rootstock (RSK) demonstrating Bitcoin-secured smart contracts with a clean Next.js frontend.

## 🚀 Features

- **Bitcoin Security**: Powered by Rootstock's Bitcoin-secured network
- **Time-Locked Content**: Messages and attachments unlock automatically
- **Private & Public**: Choose capsule visibility
- **Modern UI**: Clean, responsive interface with thirdweb integration
- **Educational**: Perfect for learning Rootstock development

## 🛠 Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Blockchain**: Rootstock (RSK), Solidity ^0.8.28
- **Web3**: Thirdweb SDK for wallet connection and contract interaction
- **UI**: Radix UI components, Lucide icons

## 📋 Prerequisites

- Node.js 18+
- MetaMask or compatible wallet
- Thirdweb account and client ID
- Test RBTC from [Rootstock Faucet](https://faucet.rootstock.io)

## 🚀 Quick Start

1. **Clone and install** 
   ```bash
      git clone https://github.com/michojekunle/time-capsule-dapp.git 
      cd time-capsule-dapp 
      pnpm install
      or 
      npm i --legacy-peer-deps
   ```

2. **Environment setup** 
   ```bash
      cp .env.example .env.local 
   ```

   Add your thirdweb client ID: 
   ```
      NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id 
   ```

4. **Start development** 
   ```bash
      pnpm dev
      or 
      npm run dev 
   ```

## 📖 Smart Contract Functions

The TimeCapsule contract includes:

- **createCapsule()**: Create time-locked capsules
- **openCapsule()**: Open unlocked capsules
- **viewCapsule()**: View capsule content (with permissions)
- **getCapsuleDetails()**: Get capsule metadata
- **getCapsulesByCreator()**: List user's capsules

## 🌐 Rootstock Integration

This dApp demonstrates:

- Connecting to Rootstock networks
- Using Bitcoin-secured infrastructure
- Handling RBTC transactions
- Rootstock block explorer integration

## 🎯 Learning Objectives

- Smart contract development on Rootstock
- Frontend integration with thirdweb
- Bitcoin sidechain concepts
- Time-locked contract patterns
- Modern dApp architecture

## 📚 Resources

- [Rootstock Documentation](https://dev.rootstock.io)
- [Rootstock Faucet](https://faucet.rootstock.io)
- [RSK Explorer](https://explorer.testnet.rsk.co)
- [Thirdweb Docs](https://portal.thirdweb.com)

## 🤝 Contributing

This is an educational project. Feel free to fork, modify, and learn!

## 📄 License

MIT License - see LICENSE file for details.