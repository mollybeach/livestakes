# Prediction Market Smart Contracts

This directory contains the Solidity smart contracts for a prediction market system on Ethereum.

## Contracts

### ProjectRegistry.sol
Manages project registration and retrieval.

**Functions:**
- `registerProject(string memory name, string memory description) public returns (uint64)` - Register a new project
- `getProject(uint64 id) public view returns (Project memory)` - Get project by ID
- `projectExists(uint64 id) public view returns (bool)` - Check if project exists

### PredictionMarket.sol
Handles prediction market creation, betting, and resolution.

**Functions:**
- `createMarket(string memory question) public returns (uint64)` - Create a new prediction market
- `placeBet(uint64 marketId, string memory outcome, uint256 amount) public` - Place a bet
- `resolveMarket(uint64 marketId, string memory outcome) public` - Resolve a market with an outcome
- `claimPayout(uint64 marketId) public` - Claim payout for winning bets
- `getMarket(uint64 id) public view returns (...)` - Get market information
- `getUserBet(uint64 marketId, address user, string memory outcome) public view returns (uint256)` - Get user bet
- `marketExists(uint64 id) public view returns (bool)` - Check if market exists

### MarketFactory.sol
Factory contract for deploying new markets.

**Functions:**
- `deployMarket(string memory question) public returns (address)` - Deploy a new market contract
- `createMarket(string memory question) public returns (address)` - Create market through factory

## Installation

```bash
cd src/blockchain
npm install
```

## Development

### Compile Contracts
```bash
npm run compile
```

### Run Tests
```bash
npm run test
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Start Local Node
```bash
npm run node
```

### Deploy Contracts

#### Local Development
```bash
npm run deploy:local
```

#### Sepolia Testnet
```bash
npm run deploy:sepolia
```

#### Mainnet
```bash
npm run deploy:mainnet
```

## Environment Variables

Create a `.env` file in the `src/blockchain` directory:

```env
PRIVATE_KEY=your_private_key_here
SEPOLIA_URL=https://sepolia.infura.io/v3/your_project_id
MAINNET_URL=https://mainnet.infura.io/v3/your_project_id
ETHERSCAN_API_KEY=your_etherscan_api_key
REPORT_GAS=true
```

## Usage Examples

### JavaScript/Node.js

#### Get Project Information
```javascript
const { getProject } = require('./scripts/getProject');

const project = await getProject(
    '0x...', // contract address
    1 // project ID
);
console.log(project);
```

#### Create a Market
```javascript
const { createMarket } = require('./transactions/createMarket');

const result = await createMarket(
    '0x...', // contract address
    'Will Bitcoin reach $100k?', // question
    '0x...' // private key
);
console.log(result);
```

#### Place a Bet
```javascript
const { placeBet } = require('./transactions/placeBet');

const result = await placeBet(
    '0x...', // contract address
    1, // market ID
    'yes', // outcome
    ethers.utils.parseEther('1.0'), // amount
    '0x...' // private key
);
console.log(result);
```

## Contract Events

### ProjectRegistry Events
- `ProjectRegistered(uint64 indexed id, string name, address indexed owner)`

### PredictionMarket Events
- `MarketCreated(uint64 indexed id, string question, address indexed creator)`
- `BetPlaced(uint64 indexed marketId, address indexed user, string outcome, uint256 amount)`
- `MarketResolved(uint64 indexed id, string outcome)`
- `PayoutClaimed(uint64 indexed marketId, address indexed user, uint256 amount)`

### MarketFactory Events
- `MarketDeployed(address indexed marketAddress, string question)`

## Data Structures

### Project
```solidity
struct Project {
    uint64 id;
    string name;
    address owner;
    string description;
    uint256 createdAt;
}
```

### Market
```solidity
struct Market {
    uint64 id;
    string question;
    address creator;
    bool isOpen;
    string outcome;
    mapping(address => mapping(string => uint256)) bets;
    mapping(string => uint256) totalBets;
}
```

## Testing

The project includes comprehensive tests for all contracts:

- `ProjectRegistry.test.js` - Tests for project registration functionality
- `PredictionMarket.test.js` - Tests for market creation, betting, and resolution
- `MarketFactory.test.js` - Tests for market factory functionality

Run tests with:
```bash
npm test
```

## Gas Optimization

The contracts are optimized for gas efficiency:
- Uses `uint64` for IDs instead of `uint256`
- Efficient storage patterns
- Minimal external calls
- Optimized event emissions

## Security Considerations

- All functions include proper access controls
- Input validation for all parameters
- Safe math operations (Solidity 0.8.19 includes overflow protection)
- Reentrancy protection through proper state management
- Event emissions for all critical operations

## Deployment

Contracts can be deployed to:
- Local Hardhat network (for development)
- Sepolia testnet (for testing)
- Ethereum mainnet (for production)

Deployment addresses are automatically saved to JSON files for easy reference.

## License

MIT License - see LICENSE file for details. 