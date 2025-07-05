const hre = require("hardhat");
const fs = require("fs");

async function main() {
    console.log("🚀 Deploying contracts to testnet...");
    console.log("Network:", hre.network.name);
    console.log("Chain ID:", hre.network.config.chainId);
    
    // Check if we have required environment variables
    if (!process.env.FLOW_EVM_TESTNET_URL && hre.network.name === 'flow-testnet') {
        console.error("❌ FLOW_EVM_TESTNET_URL not set in environment variables");
        console.log("Please set up your .env file with:");
        console.log("FLOW_EVM_TESTNET_URL=https://testnet.evm.nodes.onflow.org");
        process.exit(1);
    }
    if (!process.env.SEPOLIA_URL && hre.network.name === 'sepolia') {
        console.error("❌ SEPOLIA_URL not set in environment variables");
        console.log("Please set up your .env file with:");
        console.log("SEPOLIA_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID");
        process.exit(1);
    }
    
    if (!process.env.PRIVATE_KEY) {
        console.error("❌ PRIVATE_KEY not set in environment variables");
        console.log("Please set up your .env file with your private key");
        process.exit(1);
    }
    
    const [deployer] = await hre.ethers.getSigners();
    console.log("🔑 Deploying with account:", deployer.address);
    
    // Check account balance
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH");
    
    if (balance < hre.ethers.parseEther("0.01")) {
        console.warn("⚠️  Low balance! You may need testnet tokens.");
        if (hre.network.name === 'flow-testnet') {
            console.log("Get Flow EVM testnet FLOW from: https://testnet-faucet.onflow.org/");
        } else {
            console.log("Get Sepolia ETH from: https://sepoliafaucet.com/");
        }
    }

    try {
        // Deploy MarketFactory
        console.log("\n📝 Deploying MarketFactory...");
        const MarketFactory = await hre.ethers.getContractFactory("MarketFactory");
        const marketFactory = await MarketFactory.deploy();
        await marketFactory.waitForDeployment();
        console.log("✅ MarketFactory deployed to:", marketFactory.target);

        // Create a test market
        console.log("\n🎯 Creating test market...");
        const tx = await marketFactory.createMarket(
            [], // No livestreams initially
            "Which hackathon project will win EthGlobal?",
            [] // No titles initially
        );
        const receipt = await tx.wait();
        
        // Find the MarketCreated event
        let testMarketAddress = null;
        for (const log of receipt.logs) {
            try {
                const event = marketFactory.interface.parseLog(log);
                if (event && event.name === "MarketCreated") {
                    testMarketAddress = event.args.marketAddress;
                    console.log("✅ Test market created:");
                    console.log("   Market Address:", event.args.marketAddress);
                    console.log("   Livestream IDs:", event.args.livestreamIds.length === 0 ? "None (can add later)" : event.args.livestreamIds.map(id => id.toString()).join(", "));
                    console.log("   Question:", event.args.question);
                    break;
                }
            } catch (e) {
                // Not a MarketCreated event, continue
            }
        }

        // Save deployment info
        const deploymentInfo = {
            network: hre.network.name,
            chainId: hre.network.config.chainId,
            timestamp: new Date().toISOString(),
            deployer: deployer.address,
            contracts: {
                MarketFactory: marketFactory.target
            }
        };

        if (testMarketAddress) {
            deploymentInfo.contracts.TestPredictionMarket = testMarketAddress;
        }

        const filename = `deployment-${hre.network.name}.json`;
        fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
        console.log(`\n📄 Deployment info saved to ${filename}`);

        // Display summary
        console.log("\n🎉 Deployment Summary:");
        console.log("======================");
        console.log("Network:", hre.network.name);
        console.log("MarketFactory:", marketFactory.target);
        if (testMarketAddress) {
            console.log("Test Market:", testMarketAddress);
        }
        
        console.log("\n🔗 Block Explorer:");
        if (hre.network.name === 'flow-testnet') {
            console.log(`MarketFactory: https://evm-testnet.flowscan.org/address/${marketFactory.target}`);
            if (testMarketAddress) {
                console.log(`Test Market: https://evm-testnet.flowscan.org/address/${testMarketAddress}`);
            }
        } else if (hre.network.name === 'sepolia') {
            console.log(`MarketFactory: https://sepolia.etherscan.io/address/${marketFactory.target}`);
            if (testMarketAddress) {
                console.log(`Test Market: https://sepolia.etherscan.io/address/${testMarketAddress}`);
            }
        }

        console.log("\n📋 Next Steps:");
        console.log("1. Update your frontend configuration with the new contract addresses");
        console.log("2. Add testnet network to MetaMask");
        console.log("3. Get testnet ETH from faucets if needed");
        console.log("4. Test the betting functionality");

        // Contract verification instructions
        if (process.env.ETHERSCAN_API_KEY) {
            console.log("\n🔍 Verify contracts with:");
            console.log(`npx hardhat verify --network ${hre.network.name} ${marketFactory.target}`);
        } else {
            console.log("\n💡 To verify contracts, set ETHERSCAN_API_KEY in your .env file");
        }

    } catch (error) {
        console.error("❌ Deployment failed:", error.message);
        
        if (error.code === 'INSUFFICIENT_FUNDS') {
            console.log("\n💸 Insufficient funds! Get testnet tokens from:");
            if (hre.network.name === 'flow-testnet') {
                console.log("Flow EVM Testnet: https://testnet-faucet.onflow.org/");
            } else {
                console.log("Sepolia: https://sepoliafaucet.com/");
                console.log("Or: https://faucets.chain.link/sepolia");
            }
        }
        
        process.exit(1);
    }
}

main()
    .then(() => {
        console.log("\n🎊 Deployment completed successfully!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("💥 Deployment failed:", error);
        process.exit(1);
    }); 