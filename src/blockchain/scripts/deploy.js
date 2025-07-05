const hre = require("hardhat");

async function main() {
    console.log("Deploying contracts...");

    // Deploy ProjectRegistry
    const ProjectRegistry = await hre.ethers.getContractFactory("ProjectRegistry");
    const projectRegistry = await ProjectRegistry.deploy();
    await projectRegistry.deployed();
    console.log("ProjectRegistry deployed to:", projectRegistry.address);

    // Deploy PredictionMarket
    const PredictionMarket = await hre.ethers.getContractFactory("PredictionMarket");
    const predictionMarket = await PredictionMarket.deploy();
    await predictionMarket.deployed();
    console.log("PredictionMarket deployed to:", predictionMarket.address);

    // Create a test market
    const tx = await predictionMarket.createMarket("Will ETH reach $10k?");
    const receipt = await tx.wait();
    const event = receipt.events.find(e => e.event === "MarketCreated");
    if (event) {
        console.log("Test market created with ID:", event.args.id.toString());
    } else {
        console.log("Test market created, but event not found.");
    }

    // Deploy MarketFactory
    const MarketFactory = await hre.ethers.getContractFactory("MarketFactory");
    const marketFactory = await MarketFactory.deploy();
    await marketFactory.deployed();
    console.log("MarketFactory deployed to:", marketFactory.address);

    console.log("\nDeployment Summary:");
    console.log("===================");
    console.log("ProjectRegistry:", projectRegistry.address);
    console.log("PredictionMarket:", predictionMarket.address);
    console.log("MarketFactory:", marketFactory.address);

    // Save deployment addresses to a file
    const fs = require("fs");
    const deploymentInfo = {
        network: hre.network.name,
        timestamp: new Date().toISOString(),
        contracts: {
            ProjectRegistry: projectRegistry.address,
            PredictionMarket: predictionMarket.address,
            MarketFactory: marketFactory.address
        }
    };

    fs.writeFileSync(
        `deployment-${hre.network.name}.json`,
        JSON.stringify(deploymentInfo, null, 2)
    );
    console.log(`\nDeployment info saved to deployment-${hre.network.name}.json`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });