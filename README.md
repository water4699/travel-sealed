# TripLock - Encrypted Trip Planner

A fully encrypted trip planning application built with FHEVM (Fully Homomorphic Encryption Virtual Machine) and Next.js. Plan and analyze private travel itineraries without exposing your data.

## 🌐 Live Demo

- **Web Application**: [https://trip-eta-one.vercel.app/](https://trip-eta-one.vercel.app/)
- **Demo Video**: [TripLock Demo Video](https://github.com/DanaRaleign/travel-sealed-memories/blob/main/travel.mp4)

## 🚀 Features

- **Privacy-First**: All trip data is encrypted locally using AES-GCM before being stored on-chain
- **Homomorphic Analytics**: Travel style insights are computed using fully homomorphic encryption
- **Decentralized Storage**: Encrypted trip data is stored permanently on the blockchain
- **Multi-Network Support**: Deployable to Ethereum mainnet, testnets, and local development networks
- **Trip Builder**: Create detailed itineraries with destinations, activities, and schedules
- **Trip Vault**: Manage and view all your encrypted trips
- **Style Insights**: Analyze travel patterns across different categories (Adventure, Culture, Wellness, Family)

## 📦 Tech Stack

- **Smart Contracts**: Solidity with FHEVM for encrypted computations
- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Blockchain**: Ethereum-compatible networks with FHE support
- **Encryption**: AES-GCM for client-side encryption + FHE for on-chain analytics

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │   Smart Contract │    │   FHEVM Oracle  │
│                 │    │                 │    │                 │
│ • Trip Builder  │───▶│ • EncryptedTrip │───▶│ • Decryption    │
│ • Trip Vault    │    │   Planner       │    │   Services      │
│ • Style Insights│    │ • FHECounter    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📋 Contract Addresses

### Testnet Deployment (Sepolia)
- **EncryptedTripPlanner**: `0x271cf992495f9d14e1C0B1aB6dCC8D801bb72C42`
- **Network**: Ethereum Sepolia Testnet
- **Chain ID**: 11155111

### Local Development
- **EncryptedTripPlanner**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- **Network**: Hardhat Local Node
- **Chain ID**: 31337

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/DanaRaleign/travel-sealed-memories.git
cd travel-sealed-memories

# Install dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### Using Deployed Contracts

The application is already deployed and ready to use:

1. **Connect Wallet**: Use MetaMask to connect to Ethereum Sepolia testnet
2. **Add Sepolia Network** to MetaMask (if not already added):
   - Network Name: Sepolia
   - RPC URL: https://sepolia.infura.io/v3/YOUR_INFURA_KEY
   - Chain ID: 11155111
   - Currency Symbol: SepoliaETH
3. **Visit**: [https://trip-eta-one.vercel.app/](https://trip-eta-one.vercel.app/)

### Local Development

```bash
# Start local Hardhat node with FHEVM
npm run node

# Deploy contracts to local network
npm run deploy

# Start frontend development server
cd frontend && npm run dev
```

### Testing

```bash
# Run contract tests
npm run test

# Run frontend tests
cd frontend && npm run test
```

## 📚 Documentation

### Project Documentation
- **TripLock Live Demo**: [https://trip-eta-one.vercel.app/](https://trip-eta-one.vercel.app/)
- **GitHub Repository**: [https://github.com/DanaRaleign/travel-sealed-memories](https://github.com/DanaRaleign/travel-sealed-memories)

### Technical Documentation
- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Zama FHEVM GitHub](https://github.com/zama-ai/fhevm)

### How to Use TripLock

1. **Connect Wallet**: Connect your MetaMask wallet to Sepolia testnet
2. **Create Trip**: Use the Trip Builder to plan your itinerary
   - Enter trip title, select travel style
   - Set start and end dates
   - Add destinations and activities
3. **Encrypt & Store**: Your trip data is encrypted locally and stored on-chain
4. **View Trips**: Access your encrypted trips in the Trip Vault
5. **Analyze Insights**: View homomorphic analytics of travel patterns

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
