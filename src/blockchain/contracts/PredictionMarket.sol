// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract PredictionMarket {
    struct Market {
        uint64 id;
        string question;
        address creator;
        bool isOpen;
        string outcome;
        mapping(address => mapping(string => uint256)) bets;
        mapping(string => uint256) totalBets;
    }

    mapping(uint64 => Market) public markets;
    uint64 public nextMarketId = 1;

    event MarketCreated(uint64 indexed id, string question, address indexed creator);
    event BetPlaced(uint64 indexed marketId, address indexed user, string outcome, uint256 amount);
    event MarketResolved(uint64 indexed id, string outcome);
    event PayoutClaimed(uint64 indexed marketId, address indexed user, uint256 amount);

    function createMarket(string memory question) public returns (uint64) {
        uint64 id = nextMarketId;
        Market storage market = markets[id];
        
        market.id = id;
        market.question = question;
        market.creator = msg.sender;
        market.isOpen = true;
        market.outcome = "";
        
        nextMarketId = id + 1;
        
        emit MarketCreated(id, question, msg.sender);
        return id;
    }

    function placeBet(uint64 marketId, string memory outcome, uint256 amount) public {
        Market storage market = markets[marketId];
        require(market.id != 0, "Market not found");
        require(market.isOpen, "Market is closed");
        require(keccak256(bytes(outcome)) == keccak256(bytes("yes")) || 
                keccak256(bytes(outcome)) == keccak256(bytes("no")), "Invalid outcome");
        
        if (market.bets[msg.sender][outcome] == 0) {
            market.bets[msg.sender]["yes"] = 0;
            market.bets[msg.sender]["no"] = 0;
        }
        
        market.bets[msg.sender][outcome] += amount;
        market.totalBets[outcome] += amount;
        
        emit BetPlaced(marketId, msg.sender, outcome, amount);
    }

    function resolveMarket(uint64 marketId, string memory outcome) public {
        Market storage market = markets[marketId];
        require(market.id != 0, "Market not found");
        require(market.isOpen, "Market already resolved");
        require(keccak256(bytes(outcome)) == keccak256(bytes("yes")) || 
                keccak256(bytes(outcome)) == keccak256(bytes("no")), "Invalid outcome");
        
        market.isOpen = false;
        market.outcome = outcome;
        
        emit MarketResolved(marketId, outcome);
    }

    function claimPayout(uint64 marketId) public {
        Market storage market = markets[marketId];
        require(market.id != 0, "Market not found");
        require(!market.isOpen, "Market not resolved yet");
        require(bytes(market.outcome).length > 0, "Market not resolved yet");
        
        uint256 userBet = market.bets[msg.sender][market.outcome];
        uint256 totalWinningBets = market.totalBets[market.outcome];
        
        require(totalWinningBets > 0, "No winning bets");
        
        uint256 totalPool = market.totalBets["yes"] + market.totalBets["no"];
        uint256 payout = (userBet * totalPool) / totalWinningBets;
        
        // In a real implementation, you would transfer tokens here
        // For now, we just emit the event
        emit PayoutClaimed(marketId, msg.sender, payout);
    }

    function getMarket(uint64 id) public view returns (
        uint64 marketId,
        string memory question,
        address creator,
        bool isOpen,
        string memory outcome,
        uint256 totalYesBets,
        uint256 totalNoBets
    ) {
        Market storage market = markets[id];
        return (
            market.id,
            market.question,
            market.creator,
            market.isOpen,
            market.outcome,
            market.totalBets["yes"],
            market.totalBets["no"]
        );
    }

    function getUserBet(uint64 marketId, address user, string memory outcome) public view returns (uint256) {
        return markets[marketId].bets[user][outcome];
    }

    function marketExists(uint64 id) public view returns (bool) {
        return markets[id].id != 0;
    }
} 