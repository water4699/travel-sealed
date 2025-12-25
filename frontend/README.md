# TripLock Frontend

The TripLock frontend is a modern Next.js application that provides an encrypted trip planning interface. Users can create, manage, and analyze travel itineraries with complete privacy using Fully Homomorphic Encryption (FHE).

## 🌐 Live Application

**TripLock is live at**: [https://trip-eta-one.vercel.app/](https://trip-eta-one.vercel.app/)

## 🚀 Features

- **Encrypted Trip Planning**: Create trips with local AES-GCM encryption
- **Homomorphic Analytics**: View travel style insights computed with FHE
- **Wallet Integration**: Connect MetaMask and other Web3 wallets
- **Responsive Design**: Beautiful UI built with Tailwind CSS
- **Real-time Updates**: Live connection to blockchain state
- **Trip Builder**: Intuitive interface for planning itineraries
- **Trip Vault**: Secure storage and management of encrypted trips

## 📦 Tech Stack

- **Next.js 14**: Modern React framework with App Router
- **TypeScript**: Type-safe development experience
- **Tailwind CSS**: Utility-first styling for rapid UI development
- **ethers.js**: Ethereum blockchain interaction
- **FHEVM**: Fully Homomorphic Encryption integration

## 📋 Requirements

- **MetaMask** or compatible Web3 wallet browser extension
- **Sepolia ETH** for transaction fees (get from [Sepolia Faucet](https://sepoliafaucet.com/))

## 🚀 Using TripLock

### Live Application
1. Visit [https://trip-eta-one.vercel.app/](https://trip-eta-one.vercel.app/)
2. Connect your MetaMask wallet to **Sepolia testnet**
3. Start planning your encrypted trips!

### Local Development

1. Ensure smart contracts are deployed (see root README)

2. Install dependencies:
```sh
cd frontend
npm install
```

3. Start the development server:
```sh
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### MetaMask Setup for Sepolia

1. Open MetaMask
2. Add Sepolia Network:
   - **Network Name**: Sepolia
   - **RPC URL**: `https://sepolia.infura.io/v3/YOUR_INFURA_KEY`
   - **Chain ID**: 11155111
   - **Currency Symbol**: SepoliaETH

## 🛠️ Development

### Prerequisites

- MetaMask or compatible Web3 wallet
- Local Hardhat node running (from project root)
- Smart contracts deployed to local network

### Running Locally

1. Install dependencies:
```sh
cd frontend
npm install
```

2. Start the development server:
```sh
npm run dev
```

3. Connect MetaMask to local Hardhat network:
   - **Network Name**: Hardhat
   - **RPC URL**: http://127.0.0.1:8545
   - **Chain ID**: 31337
   - **Currency Symbol**: ETH

4. Open [http://localhost:3000](http://localhost:3000) and connect your wallet.

## Project Structure

```
frontend/
├── app/                 # Next.js app router pages
├── components/          # React components
├── fhevm/              # FHEVM integration utilities
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and encryption
├── abi/                # Contract ABIs and addresses
└── public/             # Static assets
```

### Key Components

- **TripBuilder**: Form for creating encrypted trip itineraries
- **TripVault**: Display and manage stored encrypted trips
- **InsightBoard**: View homomorphic analytics on travel styles
- **FHEVM Hooks**: Utilities for encrypted contract interactions

## 📚 Documentation

- **TripLock Live App**: [https://trip-eta-one.vercel.app/](https://trip-eta-one.vercel.app/)
- **Main Repository**: [https://github.com/DanaRaleign/travel-sealed-memories](https://github.com/DanaRaleign/travel-sealed-memories)
- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Next.js Documentation](https://nextjs.org/docs)
- [MetaMask Setup Guide](https://docs.metamask.io/wallet/how-to/run-devnet/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
