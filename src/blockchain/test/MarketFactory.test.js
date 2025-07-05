const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MarketFactory", function() {
    let MarketFactory;
    let marketFactory;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function() {
        [owner, addr1, addr2] = await ethers.getSigners();

        MarketFactory = await ethers.getContractFactory("MarketFactory");
        marketFactory = await MarketFactory.deploy();
        await marketFactory.waitForDeployment();
    });

    describe("Market Creation", function() {
        it("Should create a market for a livestream", async function() {
            const livestreamId = 1;
            const question = "Will the streamer reach 1000 viewers?";
            const livestreamTitle = "Epic Gaming Session";

            await expect(marketFactory.createMarket(livestreamId, question, livestreamTitle))
                .to.emit(marketFactory, "MarketCreated");
        });

        it("Should allow multiple markets for the same livestream", async function() {
            const livestreamId = 1;
            const question1 = "Will the streamer reach 1000 viewers?";
            const question2 = "Will the streamer complete the challenge?";
            const livestreamTitle = "Epic Gaming Session";

            await marketFactory.createMarket(livestreamId, question1, livestreamTitle);
            await marketFactory.createMarket(livestreamId, question2, livestreamTitle);

            const markets = await marketFactory.getMarketsForLivestream(livestreamId);
            expect(markets.length).to.equal(2);
        });

        it("Should track market count correctly", async function() {
            const livestreamId = 1;
            const question = "Will the streamer reach 1000 viewers?";
            const livestreamTitle = "Epic Gaming Session";

            await marketFactory.createMarket(livestreamId, question, livestreamTitle);
            await marketFactory.createMarket(livestreamId, question, livestreamTitle);

            const count = await marketFactory.getMarketCountForLivestream(livestreamId);
            expect(count).to.equal(2);

            const totalCount = await marketFactory.getTotalMarketCount();
            expect(totalCount).to.equal(2);
        });

        it("Should only allow owner to create markets", async function() {
            const livestreamId = 1;
            const question = "Will the streamer reach 1000 viewers?";
            const livestreamTitle = "Epic Gaming Session";

            await expect(
                marketFactory.connect(addr1).createMarket(livestreamId, question, livestreamTitle)
            ).to.be.revertedWith("Not owner");
        });

        it("Should validate market addresses", async function() {
            const livestreamId = 1;
            const question = "Will the streamer reach 1000 viewers?";
            const livestreamTitle = "Epic Gaming Session";

            const tx = await marketFactory.createMarket(livestreamId, question, livestreamTitle);
            const receipt = await tx.wait();
            
            // Parse the MarketCreated event to get the market address
            const iface = marketFactory.interface;
            const log = receipt.logs.find(log => {
                try {
                    return iface.parseLog(log).name === 'MarketCreated';
                } catch (e) {
                    return false;
                }
            });
            
            if (!log) {
                throw new Error("MarketCreated event not found in transaction logs");
            }
            
            const parsedLog = iface.parseLog(log);
            const marketAddress = parsedLog.args.marketAddress;

            expect(await marketFactory.isValidMarket(marketAddress)).to.be.true;
            expect(await marketFactory.isValidMarket(addr1.address)).to.be.false;
        });

        it("Should track livestream-to-market mapping", async function() {
            const livestreamId = 1;
            const question = "Will the streamer reach 1000 viewers?";
            const livestreamTitle = "Epic Gaming Session";

            const tx = await marketFactory.createMarket(livestreamId, question, livestreamTitle);
            const receipt = await tx.wait();
            
            // Parse the MarketCreated event to get the market address
            const iface = marketFactory.interface;
            const log = receipt.logs.find(log => {
                try {
                    return iface.parseLog(log).name === 'MarketCreated';
                } catch (e) {
                    return false;
                }
            });
            
            if (!log) {
                throw new Error("MarketCreated event not found in transaction logs");
            }
            
            const parsedLog = iface.parseLog(log);
            const marketAddress = parsedLog.args.marketAddress;

            const mappedLivestreamId = await marketFactory.getLivestreamForMarket(marketAddress);
            expect(mappedLivestreamId).to.equal(livestreamId);
        });
    });

    describe("Market Enumeration", function() {
        beforeEach(async function() {
            // Create multiple markets for testing
            await marketFactory.createMarket(1, "Question 1", "Stream 1");
            await marketFactory.createMarket(1, "Question 2", "Stream 1");
            await marketFactory.createMarket(2, "Question 3", "Stream 2");
        });

        it("Should get markets for specific livestream", async function() {
            const markets1 = await marketFactory.getMarketsForLivestream(1);
            const markets2 = await marketFactory.getMarketsForLivestream(2);

            expect(markets1.length).to.equal(2);
            expect(markets2.length).to.equal(1);
        });

        it("Should get all markets with pagination", async function() {
            const allMarkets = await marketFactory.getAllMarkets(0, 10);
            expect(allMarkets.length).to.equal(3);

            const firstTwo = await marketFactory.getAllMarkets(0, 2);
            expect(firstTwo.length).to.equal(2);

            const lastOne = await marketFactory.getAllMarkets(2, 10);
            expect(lastOne.length).to.equal(1);
        });

        it("Should handle pagination edge cases", async function() {
            await expect(
                marketFactory.getAllMarkets(10, 10)
            ).to.be.revertedWith("Offset out of bounds");

            // Test when limit exceeds available items
            const result = await marketFactory.getAllMarkets(0, 100);
            expect(result.length).to.equal(3);
        });
    });

    describe("Market Notifications", function() {
        let marketAddress;
        let predictionMarket;

        beforeEach(async function() {
            const tx = await marketFactory.createMarket(1, "Test Question", "Test Stream");
            const receipt = await tx.wait();
            
            // Parse the MarketCreated event to get the market address
            const iface = marketFactory.interface;
            const log = receipt.logs.find(log => {
                try {
                    return iface.parseLog(log).name === 'MarketCreated';
                } catch (e) {
                    return false;
                }
            });
            
            if (!log) {
                throw new Error("MarketCreated event not found in transaction logs");
            }
            
            const parsedLog = iface.parseLog(log);
            marketAddress = parsedLog.args.marketAddress;

            const PredictionMarket = await ethers.getContractFactory("PredictionMarket");
            predictionMarket = await PredictionMarket.attach(marketAddress);
        });

        it("Should emit MarketClosed when notified by market", async function() {
            await expect(predictionMarket.closeMarket())
                .to.emit(marketFactory, "MarketClosed")
                .withArgs(marketAddress, 1);
        });

        it("Should reject notifications from invalid markets", async function() {
            await expect(
                marketFactory.connect(addr1).notifyMarketClosed(1)
            ).to.be.revertedWith("Not a valid market");
        });
    });

    describe("Owner Management", function() {
        it("Should allow owner to transfer ownership", async function() {
            await marketFactory.transferOwnership(addr1.address);
            expect(await marketFactory.owner()).to.equal(addr1.address);
        });

        it("Should not allow non-owner to transfer ownership", async function() {
            await expect(
                marketFactory.connect(addr1).transferOwnership(addr2.address)
            ).to.be.revertedWith("Not owner");
        });

        it("Should not allow transfer to zero address", async function() {
            await expect(
                marketFactory.transferOwnership(ethers.ZeroAddress)
            ).to.be.revertedWith("Invalid address");
        });
    });

    describe("Integration Tests", function() {
        it("Should create and interact with prediction market", async function() {
            const livestreamId = 1;
            const question = "Will the streamer reach 1000 viewers?";
            const livestreamTitle = "Epic Gaming Session";

            // Create market
            const tx = await marketFactory.createMarket(livestreamId, question, livestreamTitle);
            const receipt = await tx.wait();
            
            // Parse the MarketCreated event to get the market address
            const iface = marketFactory.interface;
            const log = receipt.logs.find(log => {
                try {
                    return iface.parseLog(log).name === 'MarketCreated';
                } catch (e) {
                    return false;
                }
            });
            
            if (!log) {
                throw new Error("MarketCreated event not found in transaction logs");
            }
            
            const parsedLog = iface.parseLog(log);
            const marketAddress = parsedLog.args.marketAddress;

            // Get market contract
            const PredictionMarket = await ethers.getContractFactory("PredictionMarket");
            const market = await PredictionMarket.attach(marketAddress);

            // Verify market details
            const marketInfo = await market.getMarketInfo();
            expect(marketInfo._livestreamId).to.equal(livestreamId);
            expect(marketInfo._question).to.equal(question);
            expect(marketInfo._livestreamTitle).to.equal(livestreamTitle);
            expect(marketInfo._state).to.equal(0); // Open state
        });
    });
});