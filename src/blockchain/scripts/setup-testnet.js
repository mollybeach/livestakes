const fs = require('fs');
const path = require('path');

async function main() {
    console.log("🔧 Setting up testnet environment...\n");
    
    const envPath = path.join(__dirname, '..', '.env');
    const envExampleContent = `# Flow EVM Configuration
FLOW_EVM_TESTNET_URL=https://testnet.evm.nodes.onflow.org
FLOW_EVM_MAINNET_URL=https://mainnet.evm.nodes.onflow.org

# Ethereum Testnet Configuration
SEPOLIA_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
# Or use Alchemy: https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY

# Private key for deployment account (without 0x prefix)
# NEVER commit this to version control!
PRIVATE_KEY=your_private_key_here

# Optional: Etherscan API key for contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key_here

# Mainnet Configuration (for production)
MAINNET_URL=https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID

# Gas Settings
REPORT_GAS=true`;

    // Create .env file if it doesn't exist
    if (!fs.existsSync(envPath)) {
        fs.writeFileSync(envPath, envExampleContent);
        console.log("✅ Created .env file");
    } else {
        console.log("⚠️  .env file already exists");
    }
    
    // Create .gitignore entry for .env
    const gitignorePath = path.join(__dirname, '..', '.gitignore');
    let gitignoreContent = '';
    if (fs.existsSync(gitignorePath)) {
        gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    }
    
    if (!gitignoreContent.includes('.env')) {
        gitignoreContent += '\n# Environment variables\n.env\n';
        fs.writeFileSync(gitignorePath, gitignoreContent);
        console.log("✅ Added .env to .gitignore");
    }
    
    console.log("\n📋 Setup Complete! Next steps:");
    console.log("===============================");
    console.log("1. Edit the .env file with your values:");
    console.log("   - Flow EVM URLs are already set (no API key needed)");
    console.log("   - Add your private key (the account that will deploy)");
    console.log("   - Optional: Add Etherscan API key for verification");
    console.log("");
    console.log("2. Get testnet FLOW tokens:");
    console.log("   - Flow EVM Testnet: https://testnet-faucet.onflow.org/");
    console.log("");
    console.log("3. Deploy to Flow EVM testnet:");
    console.log("   npx hardhat run scripts/deploy-testnet.js --network flow-testnet");
    console.log("");
    console.log("4. Add Flow EVM Testnet to MetaMask:");
    console.log("   - Network Name: Flow EVM Testnet");
    console.log("   - RPC URL: https://testnet.evm.nodes.onflow.org");
    console.log("   - Chain ID: 545");
    console.log("   - Currency Symbol: FLOW");
    console.log("   - Block Explorer: https://evm-testnet.flowscan.org");
    console.log("");
    console.log("5. Alternative - Deploy to Sepolia:");
    console.log("   npx hardhat run scripts/deploy-testnet.js --network sepolia");
    console.log("");
    console.log("⚠️  IMPORTANT: Never commit your private key to version control!");
    console.log("    The .env file has been added to .gitignore");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 