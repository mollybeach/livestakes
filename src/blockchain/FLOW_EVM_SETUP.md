# Flow EVM Testnet Setup Guide

## 🎯 Deployed Contracts

### Flow EVM Testnet
- **Network**: Flow EVM Testnet  
- **Chain ID**: 545
- **MarketFactory**: [`0x1D075376Cc90078B53480D60488E2f2e64Ce866a`](https://evm-testnet.flowscan.org/address/0x1D075376Cc90078B53480D60488E2f2e64Ce866a)
- **Test Market**: [`0x531A0148643e4D5F8Da1F818b16a56b065709D12`](https://evm-testnet.flowscan.org/address/0x531A0148643e4D5F8Da1F818b16a56b065709D12)

## 🦊 MetaMask Setup

### Add Flow EVM Testnet to MetaMask

1. Open MetaMask
2. Click the network dropdown (top of the wallet)
3. Click "Add Network" or "Custom RPC"
4. Enter these details:

```
Network Name: Flow EVM Testnet
RPC URL: https://testnet.evm.nodes.onflow.org
Chain ID: 545
Currency Symbol: FLOW
Block Explorer URL: https://evm-testnet.flowscan.org
```

5. Click "Save" or "Add"

### Get Testnet FLOW Tokens

1. Visit the [Flow Testnet Faucet](https://testnet-faucet.onflow.org/)
2. Connect your wallet
3. Request testnet FLOW tokens
4. Wait for the transaction to complete

## 🧪 Testing the Betting System

1. Make sure MetaMask is connected to Flow EVM Testnet
2. Visit your livestakes.fun application
3. Click "Bet Now" on any stream
4. Connect your wallet when prompted
5. Create a new market or bet on existing ones

## 📋 Useful Links

- **Flow EVM Testnet Explorer**: https://evm-testnet.flowscan.org
- **Flow Testnet Faucet**: https://testnet-faucet.onflow.org/
- **Flow EVM Documentation**: https://developers.flow.com/evm/
- **Flow Discord**: https://discord.gg/flow

## 🔧 Development Commands

```bash
# Deploy to Flow EVM testnet
npx hardhat run scripts/deploy-testnet.js --network flow-testnet

# Verify contracts
npx hardhat verify --network flow-testnet 0x1D075376Cc90078B53480D60488E2f2e64Ce866a

# Run tests
npx hardhat test

# Create a new market
npx hardhat run transactions/createMarket.js --network flow-testnet
```

## 🚀 Frontend Configuration

The frontend is now configured to use Flow EVM testnet. If you need to switch networks, update the `CURRENT_NETWORK` variable in `src/app/lib/contractsApi.ts`:

```typescript
const CURRENT_NETWORK = 'flow-testnet'; // 'localhost' | 'flow-testnet' | 'sepolia'
```

## ⚠️ Important Notes

- Flow EVM testnet uses FLOW tokens for gas fees
- Testnet tokens have no real value
- Keep your private keys secure and never commit them to version control
- The testnet may be reset periodically, requiring redeployment

## 🎊 Success!

Your betting contracts are now live on Flow EVM testnet! Users can:
- Create betting markets for livestreams
- Place bets with testnet FLOW tokens
- View real-time odds and market information
- Claim payouts from resolved markets

Happy betting! 🎲 