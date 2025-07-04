const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PredictionMarket", function() {
    let PredictionMarket;
    let predictionMarket;
    let owner;
    let user1;
    let user2;
    let user3;

    beforeEach(async function() {
        [owner, user1, user2, user3] = await ethers.getSigners();

        PredictionMarket = await ethers.getContractFactory("PredictionMarket");
        predictionMarket = await PredictionMarket.deploy();
        await predictionMarket.deployed();
    });

    describe("Market Creation", function() {
        it("Should create a new market", async function() {
            const question = "Will Bitcoin reach $100k by end of year?";

            await expect(predictionMarket.createMarket(question))
                .to.emit(predictionMarket, "MarketCreated")
                .withArgs(1, question, owner.address);
        });

        it("Should increment market ID correctly", async function() {
            await predictionMarket.createMarket("Question 1");
            await predictionMarket.createMarket("Question 2");

            expect(await predictionMarket.nextMarketId()).to.equal(3);
        });

        it("Should return correct market data", async function() {
            const question = "Will Bitcoin reach $100k?";
            await predictionMarket.createMarket(question);

            const market = await predictionMarket.getMarket(1);
            expect(market.marketId).to.equal(1);
            expect(market.question).to.equal(question);
            expect(market.creator).to.equal(owner.address);
            expect(market.isOpen).to.be.true;
            expect(market.outcome).to.equal("");
        });
    });

    describe("Betting", function() {
        beforeEach(async function() {
            await predictionMarket.createMarket("Will Bitcoin reach $100k?");
        });

        it("Should place a bet successfully", async function() {
            const amount = ethers.utils.parseEther("1.0");

            await expect(predictionMarket.connect(user1).placeBet(1, "yes", amount))
                .to.emit(predictionMarket, "BetPlaced")
                .withArgs(1, user1.address, "yes", amount);
        });

        it("Should track user bets correctly", async function() {
            const amount = ethers.utils.parseEther("1.0");
            await predictionMarket.connect(user1).placeBet(1, "yes", amount);

            const userBet = await predictionMarket.getUserBet(1, user1.address, "yes");
            expect(userBet).to.equal(amount);
        });

        it("Should update total bets correctly", async function() {
            const amount1 = ethers.utils.parseEther("1.0");
            const amount2 = ethers.utils.parseEther("2.0");

            await predictionMarket.connect(user1).placeBet(1, "yes", amount1);
            await predictionMarket.connect(user2).placeBet(1, "no", amount2);

            const market = await predictionMarket.getMarket(1);
            expect(market.totalYesBets).to.equal(amount1);
            expect(market.totalNoBets).to.equal(amount2);
        });

        it("Should reject invalid outcomes", async function() {
            const amount = ethers.utils.parseEther("1.0");

            await expect(
                predictionMarket.connect(user1).placeBet(1, "maybe", amount)
            ).to.be.revertedWith("Invalid outcome");
        });

        it("Should reject bets on non-existent markets", async function() {
            const amount = ethers.utils.parseEther("1.0");

            await expect(
                predictionMarket.connect(user1).placeBet(999, "yes", amount)
            ).to.be.revertedWith("Market not found");
        });
    });

    describe("Market Resolution", function() {
        beforeEach(async function() {
            await predictionMarket.createMarket("Will Bitcoin reach $100k?");
        });

        it("Should resolve market successfully", async function() {
            await expect(predictionMarket.resolveMarket(1, "yes"))
                .to.emit(predictionMarket, "MarketResolved")
                .withArgs(1, "yes");

            const market = await predictionMarket.getMarket(1);
            expect(market.isOpen).to.be.false;
            expect(market.outcome).to.equal("yes");
        });

        it("Should reject resolution of already resolved market", async function() {
            await predictionMarket.resolveMarket(1, "yes");

            await expect(
                predictionMarket.resolveMarket(1, "no")
            ).to.be.revertedWith("Market already resolved");
        });

        it("Should reject invalid outcomes during resolution", async function() {
            await expect(
                predictionMarket.resolveMarket(1, "maybe")
            ).to.be.revertedWith("Invalid outcome");
        });
    });

    describe("Payout Claims", function() {
        beforeEach(async function() {
            await predictionMarket.createMarket("Will Bitcoin reach $100k?");
            await predictionMarket.connect(user1).placeBet(1, "yes", ethers.utils.parseEther("1.0"));
            await predictionMarket.connect(user2).placeBet(1, "no", ethers.utils.parseEther("2.0"));
            await predictionMarket.resolveMarket(1, "yes");
        });

        it("Should allow payout claims for winning bets", async function() {
            await expect(predictionMarket.connect(user1).claimPayout(1))
                .to.emit(predictionMarket, "PayoutClaimed")
                .withArgs(1, user1.address, ethers.utils.parseEther("3.0"));
        });

        it("Should reject payout claims for unresolved markets", async function() {
            await predictionMarket.createMarket("Another question");
            await predictionMarket.connect(user1).placeBet(2, "yes", ethers.utils.parseEther("1.0"));

            await expect(
                predictionMarket.connect(user1).claimPayout(2)
            ).to.be.revertedWith("Market not resolved yet");
        });

        it("Should reject payout claims for losing bets", async function() {
            await expect(
                predictionMarket.connect(user2).claimPayout(1)
            ).to.be.revertedWith("No winning bets");
        });
    });

    describe("Market Existence", function() {
        it("Should check market existence correctly", async function() {
            expect(await predictionMarket.marketExists(1)).to.be.false;

            await predictionMarket.createMarket("Test question");

            expect(await predictionMarket.marketExists(1)).to.be.true;
            expect(await predictionMarket.marketExists(999)).to.be.false;
        });
    });
});