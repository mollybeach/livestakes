// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract PredictionMarket {
    enum Side { Yes, No }

    struct Market {
        uint64 id;
        string question;
        address creator;
        bool isOpen;
        Side outcome;
        mapping(address => mapping(uint8 => uint256)) bets;
        mapping(uint8 => uint256) totalBets;
    }

    mapping(uint64 => Market) public markets;
    uint64 public nextMarketId = 1;

    event MarketCreated(uint64 indexed id, string question, address indexed creator);
    event BetPlaced(uint64 indexed id, address indexed user, Side outcome, uint256 amount);
    event MarketResolved(uint64 indexed id, Side outcome);
    event PayoutClaimed(uint64 indexed id, address indexed user, uint256 amount);

    function _toSide(string memory s) internal pure returns (Side) {
        bytes32 h = keccak256(bytes(_lower(s)));
        if (h == keccak256("yes")) return Side.Yes;
        if (h == keccak256("no"))  return Side.No;
        revert("Invalid outcome");
    }

    function _lower(string memory s) internal pure returns (string memory) {
        bytes memory b = bytes(s);
        for (uint i; i < b.length; ++i)
            if (b[i] >= 0x41 && b[i] <= 0x5A) b[i] = bytes1(uint8(b[i]) + 32); // A-Z → a-z
        return string(b);
    }

    function createMarket(string memory question) external returns (uint64 id) {
        id = nextMarketId++;
        Market storage m = markets[id];
        m.id = id;
        m.question = question;
        m.creator = msg.sender;
        m.isOpen = true;
        emit MarketCreated(id, question, msg.sender);
        return id;
    }

    function placeBet(uint64 id, string memory outcome, uint256 amount) external {
        Market storage m = markets[id];
        require(m.id != 0, "Market not found");
        require(m.isOpen, "Market closed");
        require(amount > 0, "Zero bet");

        Side side = _toSide(outcome);
        m.bets[msg.sender][uint8(side)] += amount;
        m.totalBets[uint8(side)] += amount;
        emit BetPlaced(id, msg.sender, side, amount);
    }

    function resolveMarket(uint64 id, string memory outcome) external {
        Market storage m = markets[id];
        require(m.id != 0, "Market not found");
        require(m.isOpen, "Already resolved");
        Side side = _toSide(outcome);
        m.isOpen = false;
        m.outcome = side;
        emit MarketResolved(id, side);
    }

    function claimPayout(uint64 id) external {
        Market storage m = markets[id];
        require(!m.isOpen, "Market not resolved");
        uint256 userBet = m.bets[msg.sender][uint8(m.outcome)];
        uint256 winners = m.totalBets[uint8(m.outcome)];
        require(userBet > 0, "Nothing to claim");

        uint256 pool = m.totalBets[uint8(Side.Yes)] + m.totalBets[uint8(Side.No)];
        uint256 payout = (userBet * pool) / winners;

        // TODO: transfer payout (ether or ERC-20) to msg.sender
        emit PayoutClaimed(id, msg.sender, payout);
    }

    function getMarket(uint64 id) external view returns (
        string memory question,
        address creator,
        bool isOpen,
        Side outcome,
        uint256 totalYes,
        uint256 totalNo
    ) {
        Market storage m = markets[id];
        return (
            m.question,
            m.creator,
            m.isOpen,
            m.outcome,
            m.totalBets[uint8(Side.Yes)],
            m.totalBets[uint8(Side.No)]
        );
    }

    function getUserBet(uint64 id, address user, string memory outcome)
        external view returns (uint256)
    {
        return markets[id].bets[user][uint8(_toSide(outcome))];
    }

    function marketExists(uint64 id) external view returns (bool) {
        return markets[id].id != 0;
    }
} 