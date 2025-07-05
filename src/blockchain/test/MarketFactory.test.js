const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MarketFactory", function() {
    let MarketFactory;
    let marketFactory;
    let owner;

    beforeEach(async function() {
        [owner] = await ethers.getSigners();

        MarketFactory = await ethers.getContractFactory("MarketFactory");
        marketFactory = await MarketFactory.deploy();
        await marketFactory.deployed();
    });

    describe("Market Deployment", function() {
        it("Should deploy a market successfully", async function() {
            const question = "Will Bitcoin reach $100k?";

            await expect(marketFactory.deployMarket(question))
                .to.emit(marketFactory, "MarketDeployed")
                .withArgs(ethers.constants.AddressZero, question);
        });

        it("Should return correct address", async function() {
            const question = "Test question";
            const deployedAddress = await marketFactory.deployMarket(question);

            // In this demo implementation, it returns a dummy address
            expect(deployedAddress).to.equal(ethers.constants.AddressZero);
        });

        it("Should create market through factory", async function() {
            const question = "Will Ethereum reach $10k?";

            await expect(marketFactory.createMarket(question))
                .to.emit(marketFactory, "MarketDeployed")
                .withArgs(ethers.constants.AddressZero, question);
        });
    });

    describe("Multiple Deployments", function() {
        it("Should handle multiple market deployments", async function() {
            const questions = [
                "Will Bitcoin reach $100k?",
                "Will Ethereum reach $10k?",
                "Will Solana reach $500?"
            ];

            for (let i = 0; i < questions.length; i++) {
                await expect(marketFactory.deployMarket(questions[i]))
                    .to.emit(marketFactory, "MarketDeployed")
                    .withArgs(ethers.constants.AddressZero, questions[i]);
            }
        });
    });
});