const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PredictionMarket", function() {
    let PredictionMarket;
    let MarketFactory;
    let predictionMarket;
    let marketFactory;
    let owner;
    let user1;
    let user2;
    let user3;

    beforeEach(async function() {
        [owner, user1, user2, user3] = await ethers.getSigners();

        // Deploy MarketFactory first
        MarketFactory = await ethers.getContractFactory("MarketFactory");
        marketFactory = await MarketFactory.deploy();
        await marketFactory.waitForDeployment();

        // Create a prediction market through the factory
        const tx = await marketFactory.createMarket(
            1, // livestreamId
            "Will the streamer reach 1000 viewers?",
            "Epic Gaming Session"
        );
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

        // Attach to the created market
        PredictionMarket = await ethers.getContractFactory("PredictionMarket");
        predictionMarket = await PredictionMarket.attach(marketAddress);
    });

    describe("Market Information", function() {
        it("Should return correct market information", async function() {
            const marketInfo = await predictionMarket.getMarketInfo();
            
            expect(marketInfo._livestreamId).to.equal(1);
            expect(marketInfo._question).to.equal("Will the streamer reach 1000 viewers?");
            expect(marketInfo._livestreamTitle).to.equal("Epic Gaming Session");
            expect(marketInfo._state).to.equal(0); // Open state
            expect(marketInfo._totalPool).to.equal(0);
            expect(marketInfo._totalBettors).to.equal(0);
        });

        it("Should track creation timestamp", async function() {
            const marketInfo = await predictionMarket.getMarketInfo();
            const blockTimestamp = (await ethers.provider.getBlock()).timestamp;
            
            expect(marketInfo._createdAt).to.be.closeTo(blockTimestamp, 5);
        });
    });

    describe("Betting", function() {
        it("Should place a bet successfully", async function() {
            const betAmount = ethers.parseEther("1.0");

            await expect(predictionMarket.connect(user1).placeBet(0, { value: betAmount }))
                .to.emit(predictionMarket, "BetPlaced");
        });

        it("Should track user bets correctly", async function() {
            const betAmount = ethers.parseEther("1.0");
            
            await predictionMarket.connect(user1).placeBet(0, { value: betAmount });
            
            const userBets = await predictionMarket.getUserBets(user1.address);
            expect(userBets.yesBets).to.equal(betAmount);
            expect(userBets.noBets).to.equal(0);
        });

        it("Should update market totals correctly", async function() {
            const betAmount1 = ethers.parseEther("2.0");
            const betAmount2 = ethers.parseEther("3.0");
            
            await predictionMarket.connect(user1).placeBet(0, { value: betAmount1 }); // Yes
            await predictionMarket.connect(user2).placeBet(1, { value: betAmount2 }); // No
            
            const marketInfo = await predictionMarket.getMarketInfo();
            expect(marketInfo._yesBets).to.equal(betAmount1);
            expect(marketInfo._noBets).to.equal(betAmount2);
            expect(marketInfo._totalPool).to.equal(betAmount1 + betAmount2);
            expect(marketInfo._totalBettors).to.equal(2);
        });

        it("Should track unique bettors", async function() {
            const betAmount = ethers.parseEther("1.0");
            
            // User1 bets twice
            await predictionMarket.connect(user1).placeBet(0, { value: betAmount });
            await predictionMarket.connect(user1).placeBet(1, { value: betAmount });
            
            // User2 bets once
            await predictionMarket.connect(user2).placeBet(0, { value: betAmount });
            
            const marketInfo = await predictionMarket.getMarketInfo();
            expect(marketInfo._totalBettors).to.equal(2); // Should still be 2 unique bettors
        });

        it("Should reject bets with no value", async function() {
            await expect(
                predictionMarket.connect(user1).placeBet(0, { value: 0 })
            ).to.be.revertedWith("Must send ETH");
        });

        it("Should reject bets on closed market", async function() {
            await predictionMarket.closeMarket();
            const betAmount = ethers.parseEther("1.0");
            
            await expect(
                predictionMarket.connect(user1).placeBet(0, { value: betAmount })
            ).to.be.revertedWith("Invalid state");
        });
    });

    describe("Market Lifecycle", function() {
        beforeEach(async function() {
            // Place some bets
            await predictionMarket.connect(user1).placeBet(0, { value: ethers.parseEther("2.0") });
            await predictionMarket.connect(user2).placeBet(1, { value: ethers.parseEther("3.0") });
        });

        it("Should close market successfully", async function() {
            await expect(predictionMarket.closeMarket())
                .to.emit(predictionMarket, "MarketClosed")
                .to.emit(marketFactory, "MarketClosed");
            
            const marketInfo = await predictionMarket.getMarketInfo();
            expect(marketInfo._state).to.equal(1); // Closed state
        });

        it("Should resolve market successfully", async function() {
            await predictionMarket.closeMarket();
            
            await expect(predictionMarket.resolveMarket(0)) // Resolve to Yes
                .to.emit(predictionMarket, "MarketResolved");
            
            const marketInfo = await predictionMarket.getMarketInfo();
            expect(marketInfo._state).to.equal(2); // Resolved state
            expect(marketInfo._outcome).to.equal(0); // Yes outcome
        });

        it("Should reject resolution before closing", async function() {
            await expect(
                predictionMarket.resolveMarket(0)
            ).to.be.revertedWith("Invalid state");
        });

        it("Should only allow oracle to close and resolve", async function() {
            await expect(
                predictionMarket.connect(user1).closeMarket()
            ).to.be.revertedWith("Not oracle");
            
            await predictionMarket.closeMarket();
            
            await expect(
                predictionMarket.connect(user1).resolveMarket(0)
            ).to.be.revertedWith("Not oracle");
        });
    });

    describe("Payout System", function() {
        beforeEach(async function() {
            // Setup: User1 bets 2 ETH on Yes, User2 bets 3 ETH on No
            await predictionMarket.connect(user1).placeBet(0, { value: ethers.parseEther("2.0") });
            await predictionMarket.connect(user2).placeBet(1, { value: ethers.parseEther("3.0") });
            
            // Close and resolve market (Yes wins)
            await predictionMarket.closeMarket();
            await predictionMarket.resolveMarket(0);
        });

        it("Should calculate payout correctly for winner", async function() {
            const initialBalance = await ethers.provider.getBalance(user1.address);
            
            const tx = await predictionMarket.connect(user1).claimPayout();
            const receipt = await tx.wait();
            const gasUsed = receipt.gasUsed * receipt.gasPrice;
            
            const finalBalance = await ethers.provider.getBalance(user1.address);
            const expectedPayout = ethers.parseEther("5.0"); // Should get all 5 ETH
            
            expect(finalBalance + gasUsed - initialBalance).to.equal(expectedPayout);
        });

        it("Should emit payout event", async function() {
            await expect(predictionMarket.connect(user1).claimPayout())
                .to.emit(predictionMarket, "PayoutClaimed");
        });

        it("Should prevent double claiming", async function() {
            await predictionMarket.connect(user1).claimPayout();
            
            await expect(
                predictionMarket.connect(user1).claimPayout()
            ).to.be.revertedWith("No winning bet");
        });

        it("Should reject payout for losing bet", async function() {
            await expect(
                predictionMarket.connect(user2).claimPayout()
            ).to.be.revertedWith("No winning bet");
        });

        it("Should reject payout before resolution", async function() {
            // Create new market
            const tx = await marketFactory.createMarket(2, "Test Question", "Test Stream");
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
            const newMarketAddress = parsedLog.args.marketAddress;
            
            const newMarket = await PredictionMarket.attach(newMarketAddress);
            await newMarket.connect(user1).placeBet(0, { value: ethers.parseEther("1.0") });
            
            await expect(
                newMarket.connect(user1).claimPayout()
            ).to.be.revertedWith("Invalid state");
        });
    });

    describe("Market Analytics", function() {
        beforeEach(async function() {
            await predictionMarket.connect(user1).placeBet(0, { value: ethers.parseEther("2.0") });
            await predictionMarket.connect(user2).placeBet(1, { value: ethers.parseEther("3.0") });
        });

        it("Should calculate odds correctly", async function() {
            const odds = await predictionMarket.getOdds();
            
            // 2 ETH Yes, 3 ETH No out of 5 ETH total
            expect(odds.yesOdds).to.equal(40); // 2/5 * 100 = 40%
            expect(odds.noOdds).to.equal(60);  // 3/5 * 100 = 60%
        });

        it("Should handle odds with no bets", async function() {
            // Create new market with no bets
            const tx = await marketFactory.createMarket(2, "Test Question", "Test Stream");
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
            const newMarketAddress = parsedLog.args.marketAddress;
            
            const newMarket = await PredictionMarket.attach(newMarketAddress);
            const odds = await newMarket.getOdds();
            
            expect(odds.yesOdds).to.equal(100); // 50/50 default
            expect(odds.noOdds).to.equal(100);
        });

        it("Should calculate potential payout", async function() {
            const payout = await predictionMarket.getPotentialPayout(user1.address, 0);
            
            // User1 has 2 ETH on Yes, total pool is 5 ETH
            // If Yes wins, user1 gets all 5 ETH
            expect(payout).to.equal(ethers.parseEther("5.0"));
        });

        it("Should get bettors list", async function() {
            await predictionMarket.connect(user3).placeBet(0, { value: ethers.parseEther("1.0") });
            
            const bettors = await predictionMarket.getBettorsList(0, 10);
            expect(bettors.length).to.equal(3);
            expect(bettors).to.include(user1.address);
            expect(bettors).to.include(user2.address);
            expect(bettors).to.include(user3.address);
        });

        it("Should handle bettors pagination", async function() {
            const firstTwo = await predictionMarket.getBettorsList(0, 2);
            expect(firstTwo.length).to.equal(2);
            
            const offset = await predictionMarket.getBettorsList(1, 10);
            expect(offset.length).to.equal(1);
        });
    });

    describe("Emergency Functions", function() {
        it("Should allow emergency close", async function() {
            await expect(predictionMarket.emergencyClose())
                .to.emit(predictionMarket, "MarketClosed");
            
            const marketInfo = await predictionMarket.getMarketInfo();
            expect(marketInfo._state).to.equal(1); // Closed state
        });

        it("Should allow oracle change", async function() {
            await predictionMarket.changeOracle(user1.address);
            expect(await predictionMarket.oracle()).to.equal(user1.address);
        });

        it("Should reject oracle change from non-oracle", async function() {
            await expect(
                predictionMarket.connect(user1).changeOracle(user2.address)
            ).to.be.revertedWith("Not oracle");
        });
    });

    describe("Edge Cases", function() {
        it("Should handle multiple bets from same user", async function() {
            const bet1 = ethers.parseEther("1.0");
            const bet2 = ethers.parseEther("2.0");
            
            await predictionMarket.connect(user1).placeBet(0, { value: bet1 });
            await predictionMarket.connect(user1).placeBet(0, { value: bet2 });
            
            const userBets = await predictionMarket.getUserBets(user1.address);
            expect(userBets.yesBets).to.equal(bet1 + bet2);
            
            const marketInfo = await predictionMarket.getMarketInfo();
            expect(marketInfo._totalBettors).to.equal(1); // Still one unique bettor
        });

        it("Should handle user betting on both sides", async function() {
            const betAmount = ethers.parseEther("1.0");
            
            await predictionMarket.connect(user1).placeBet(0, { value: betAmount });
            await predictionMarket.connect(user1).placeBet(1, { value: betAmount });
            
            const userBets = await predictionMarket.getUserBets(user1.address);
            expect(userBets.yesBets).to.equal(betAmount);
            expect(userBets.noBets).to.equal(betAmount);
        });
    });
});