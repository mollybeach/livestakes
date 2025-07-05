const hre = require("hardhat");

async function main() {
    console.log("Deploying contracts...");
    
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying with account:", deployer.address);

    // Deploy MarketFactory
    const MarketFactory = await hre.ethers.getContractFactory("MarketFactory");
    const marketFactory = await MarketFactory.deploy();
    await marketFactory.waitForDeployment();
    console.log("MarketFactory deployed to:", marketFactory.target);

    // Create a test market through the factory
    console.log("\nCreating test market...");
    const tx = await marketFactory.createMarket(
        1, // livestreamId
        "Will the streamer reach 1000 viewers?",
        "Epic Gaming Session"
    );
    const receipt = await tx.wait();
    
    // Find the MarketCreated event
    const event = receipt.events?.find(e => e.event === "MarketCreated");
    if (event) {
        console.log("Test market created:");
        console.log("  Market Address:", event.args.marketAddress);
        console.log("  Livestream ID:", event.args.livestreamId.toString());
        console.log("  Question:", event.args.question);
    } else {
        console.log("Test market created, but event not found.");
    }

    console.log("\nDeployment Summary:");
    console.log("===================");
    console.log("MarketFactory:", marketFactory.target);
    if (event) {
        console.log("Test PredictionMarket:", event.args.marketAddress);
    }

    // Save deployment addresses to a file
    const fs = require("fs");
    const deploymentInfo = {
        network: hre.network.name,
        timestamp: new Date().toISOString(),
        contracts: {
            MarketFactory: marketFactory.target
        }
    };

    if (event) {
        deploymentInfo.contracts.TestPredictionMarket = event.args.marketAddress;
    }

    fs.writeFileSync(
        `deployment-${hre.network.name}.json`,
        JSON.stringify(deploymentInfo, null, 2)
    );
    console.log(`\nDeployment info saved to deployment-${hre.network.name}.json`);
    
    // Display useful information
    console.log("\nUseful Commands:");
    console.log("================");
    console.log("# Create a new market:");
    console.log(`npx hardhat run scripts/createMarket.js --network ${hre.network.name}`);
    console.log("# Place a bet:");
    console.log(`npx hardhat run scripts/placeBet.js --network ${hre.network.name}`);
    console.log("# Run tests:");
    console.log("npx hardhat test");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });