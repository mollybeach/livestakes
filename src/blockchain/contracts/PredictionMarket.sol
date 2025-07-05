// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IMarketFactory {
    function notifyMarketClosed(uint256[] calldata livestreamIds) external;
}

contract PredictionMarket {
    enum Side { Yes, No }
    enum State { Open, Closed, Resolved }

    uint256[] public livestreamIds;
    string public question;
    string[] public livestreamTitles;
    address public oracle;
    address public factory;
    State public state;
    Side public outcome;
    uint256 public createdAt;
    uint256 public closedAt;
    uint256 public resolvedAt;

    mapping(address => mapping(uint8 => uint256)) public bets;
    mapping(uint8 => uint256) public totalBets;
    uint256 public totalPool;
    
    // Track unique bettors for analytics
    mapping(address => bool) public hasBet;
    address[] public bettors;
    uint256 public totalBettors;

    event BetPlaced(address indexed user, Side side, uint256 amount, uint256 timestamp);
    event MarketClosed(uint256 timestamp);
    event MarketResolved(Side outcome, uint256 timestamp);
    event PayoutClaimed(address indexed user, uint256 amount, uint256 timestamp);
    event LivestreamAdded(uint256 indexed livestreamId, string title);
    event LivestreamRemoved(uint256 indexed livestreamId);

    modifier onlyOracle() {
        require(msg.sender == oracle, "Not oracle");
        _;
    }
    
    modifier inState(State _state) {
        require(state == _state, "Invalid state");
        _;
    }

    modifier onlyFactory() {
        require(msg.sender == factory, "Not factory");
        _;
    }

    constructor(
        uint256[] memory _livestreamIds, 
        string memory _question, 
        string[] memory _livestreamTitles,
        address _oracle
    ) {
        require(_livestreamIds.length > 0, "Must have at least one livestream");
        require(_livestreamIds.length == _livestreamTitles.length, "Mismatched arrays");
        
        livestreamIds = _livestreamIds;
        question = _question;
        livestreamTitles = _livestreamTitles;
        oracle = _oracle;
        factory = msg.sender;
        state = State.Open;
        createdAt = block.timestamp;
    }

    function addLivestream(uint256 _livestreamId, string memory _title) external onlyOracle inState(State.Open) {
        // Check if livestream already exists
        for (uint256 i = 0; i < livestreamIds.length; i++) {
            require(livestreamIds[i] != _livestreamId, "Livestream already exists");
        }
        
        livestreamIds.push(_livestreamId);
        livestreamTitles.push(_title);
        
        emit LivestreamAdded(_livestreamId, _title);
    }

    function removeLivestream(uint256 _livestreamId) external onlyOracle inState(State.Open) {
        require(livestreamIds.length > 1, "Must have at least one livestream");
        
        // Find and remove the livestream
        for (uint256 i = 0; i < livestreamIds.length; i++) {
            if (livestreamIds[i] == _livestreamId) {
                // Move last element to this position
                livestreamIds[i] = livestreamIds[livestreamIds.length - 1];
                livestreamTitles[i] = livestreamTitles[livestreamTitles.length - 1];
                
                // Remove last element
                livestreamIds.pop();
                livestreamTitles.pop();
                
                emit LivestreamRemoved(_livestreamId);
                return;
            }
        }
        
        revert("Livestream not found");
    }

    function placeBet(Side side) external payable inState(State.Open) {
        require(msg.value > 0, "Must send ETH");
        
        // Track new bettor
        if (!hasBet[msg.sender]) {
            hasBet[msg.sender] = true;
            bettors.push(msg.sender);
            totalBettors++;
        }
        
        bets[msg.sender][uint8(side)] += msg.value;
        totalBets[uint8(side)] += msg.value;
        totalPool += msg.value;
        
        emit BetPlaced(msg.sender, side, msg.value, block.timestamp);
    }

    function closeMarket() external onlyOracle inState(State.Open) {
        state = State.Closed;
        closedAt = block.timestamp;
        
        // Notify factory about all associated livestreams
        IMarketFactory(factory).notifyMarketClosed(livestreamIds);
        
        emit MarketClosed(block.timestamp);
    }

    function resolveMarket(Side _outcome) external onlyOracle inState(State.Closed) {
        outcome = _outcome;
        state = State.Resolved;
        resolvedAt = block.timestamp;
        
        emit MarketResolved(_outcome, block.timestamp);
    }

    function claimPayout() external inState(State.Resolved) {
        uint256 userBet = bets[msg.sender][uint8(outcome)];
        require(userBet > 0, "No winning bet");
        
        uint256 winningPool = totalBets[uint8(outcome)];
        require(winningPool > 0, "No winning bets");
        
        // Calculate payout: user's proportion of winning pool gets proportional share of total pool
        uint256 payout = (userBet * totalPool) / winningPool;
        
        // Reset user's bet to prevent double claiming
        bets[msg.sender][uint8(outcome)] = 0;
        
        // Transfer payout
        (bool success, ) = msg.sender.call{value: payout}("");
        require(success, "Transfer failed");
        
        emit PayoutClaimed(msg.sender, payout, block.timestamp);
    }

    // View functions
    function getMarketInfo() external view returns (
        uint256[] memory _livestreamIds,
        string memory _question,
        string[] memory _livestreamTitles,
        State _state,
        Side _outcome,
        uint256 _yesBets,
        uint256 _noBets,
        uint256 _totalPool,
        uint256 _totalBettors,
        uint256 _createdAt,
        uint256 _closedAt,
        uint256 _resolvedAt
    ) {
        return (
            livestreamIds,
            question,
            livestreamTitles,
            state,
            outcome,
            totalBets[uint8(Side.Yes)],
            totalBets[uint8(Side.No)],
            totalPool,
            totalBettors,
            createdAt,
            closedAt,
            resolvedAt
        );
    }

    function getLivestreamCount() external view returns (uint256) {
        return livestreamIds.length;
    }

    function getLivestreamId(uint256 index) external view returns (uint256) {
        require(index < livestreamIds.length, "Index out of bounds");
        return livestreamIds[index];
    }

    function getLivestreamTitle(uint256 index) external view returns (string memory) {
        require(index < livestreamTitles.length, "Index out of bounds");
        return livestreamTitles[index];
    }

    function getAllLivestreamIds() external view returns (uint256[] memory) {
        return livestreamIds;
    }

    function getAllLivestreamTitles() external view returns (string[] memory) {
        return livestreamTitles;
    }

    function isLivestreamInMarket(uint256 _livestreamId) external view returns (bool) {
        for (uint256 i = 0; i < livestreamIds.length; i++) {
            if (livestreamIds[i] == _livestreamId) {
                return true;
            }
        }
        return false;
    }

    function getUserBets(address user) external view returns (uint256 yesBets, uint256 noBets) {
        return (
            bets[user][uint8(Side.Yes)],
            bets[user][uint8(Side.No)]
        );
    }

    function getOdds() external view returns (uint256 yesOdds, uint256 noOdds) {
        if (totalPool == 0) return (100, 100); // 50/50 if no bets
        
        uint256 yesPool = totalBets[uint8(Side.Yes)];
        uint256 noPool = totalBets[uint8(Side.No)];
        
        if (yesPool == 0) return (0, 200);
        if (noPool == 0) return (200, 0);
        
        // Calculate implied probability as percentage
        yesOdds = (yesPool * 100) / totalPool;
        noOdds = (noPool * 100) / totalPool;
    }

    function getPotentialPayout(address user, Side side) external view returns (uint256) {
        if (state != State.Open) return 0;
        
        uint256 userBet = bets[user][uint8(side)];
        if (userBet == 0) return 0;
        
        uint256 sidePool = totalBets[uint8(side)];
        if (sidePool == 0) return 0;
        
        return (userBet * totalPool) / sidePool;
    }

    function getBettorsList(uint256 offset, uint256 limit) external view returns (address[] memory) {
        require(offset < bettors.length, "Offset out of bounds");
        
        uint256 end = offset + limit;
        if (end > bettors.length) {
            end = bettors.length;
        }
        
        address[] memory result = new address[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            result[i - offset] = bettors[i];
        }
        
        return result;
    }

    // Emergency functions
    function emergencyClose() external onlyOracle {
        require(state == State.Open, "Market not open");
        state = State.Closed;
        closedAt = block.timestamp;
        emit MarketClosed(block.timestamp);
    }

    function changeOracle(address newOracle) external onlyOracle {
        require(newOracle != address(0), "Invalid address");
        oracle = newOracle;
    }
} 