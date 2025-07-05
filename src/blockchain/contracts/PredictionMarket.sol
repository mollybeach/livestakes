// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IMarketFactory {
    function notifyMarketClosed(uint256[] calldata livestreamIds) external;
}

contract PredictionMarket {
    enum State { Open, Closed, Resolved }

    struct LivestreamData {
        uint256 id;
        string title;
        bool active;
        uint256 addedAt;
    }

    mapping(uint256 => LivestreamData) public livestreams;
    uint256[] public livestreamIds; // For enumeration
    
    string public question;
    address public oracle;
    address public factory;
    State public state;
    uint256 public winningLivestreamId; // Changed from Side outcome to winning livestream ID
    uint256 public createdAt;
    uint256 public closedAt;
    uint256 public resolvedAt;

    // Per-livestream betting instead of Yes/No
    mapping(address => mapping(uint256 => uint256)) public bets; // user -> livestreamId -> amount
    mapping(uint256 => uint256) public totalBets; // livestreamId -> total amount
    uint256 public totalPool;
    
    // Track unique bettors for analytics
    mapping(address => bool) public hasBet;
    address[] public bettors;
    uint256 public totalBettors;

    event BetPlaced(address indexed user, uint256 indexed livestreamId, uint256 amount, uint256 timestamp);
    event MarketClosed(uint256 timestamp);
    event MarketResolved(uint256 indexed winningLivestreamId, uint256 timestamp);
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
        // Allow creating markets without livestreams initially
        require(_livestreamIds.length == _livestreamTitles.length, "Mismatched arrays");
        
        question = _question;
        oracle = _oracle;
        factory = msg.sender;
        state = State.Open;
        createdAt = block.timestamp;
        
        // Initialize livestreams using struct mapping (can be empty)
        for (uint256 i = 0; i < _livestreamIds.length; i++) {
            uint256 livestreamId = _livestreamIds[i];
            require(livestreamId != 0, "Invalid livestream ID");
            require(!livestreams[livestreamId].active, "Livestream already exists");
            
            livestreams[livestreamId] = LivestreamData({
                id: livestreamId,
                title: _livestreamTitles[i],
                active: true,
                addedAt: block.timestamp
            });
            
            livestreamIds.push(livestreamId);
        }
    }

    function addLivestream(uint256 _livestreamId, string memory _title) external onlyOracle inState(State.Open) {
        require(_livestreamId != 0, "Invalid livestream ID");
        require(!livestreams[_livestreamId].active, "Livestream already exists");
        
        livestreams[_livestreamId] = LivestreamData({
            id: _livestreamId,
            title: _title,
            active: true,
            addedAt: block.timestamp
        });
        
        livestreamIds.push(_livestreamId);
        
        emit LivestreamAdded(_livestreamId, _title);
    }

    // Update livestream title (useful for auto-added livestreams)
    function updateLivestreamTitle(uint256 _livestreamId, string memory _newTitle) external onlyOracle inState(State.Open) {
        require(livestreams[_livestreamId].id != 0, "Livestream not found");
        require(livestreams[_livestreamId].active, "Livestream not active");
        
        livestreams[_livestreamId].title = _newTitle;
        
        emit LivestreamAdded(_livestreamId, _newTitle); // Reuse event for simplicity
    }

    // Public function to add livestream with proper title (anyone can call)
    function addLivestreamWithTitle(uint256 _livestreamId, string memory _title) external inState(State.Open) {
        require(_livestreamId > 0, "Invalid livestream ID");
        require(bytes(_title).length > 0, "Title cannot be empty");
        
        // If livestream doesn't exist, add it
        if (livestreams[_livestreamId].id == 0) {
            livestreams[_livestreamId] = LivestreamData({
                id: _livestreamId,
                title: _title,
                active: true,
                addedAt: block.timestamp
            });
            
            livestreamIds.push(_livestreamId);
            
            emit LivestreamAdded(_livestreamId, _title);
        } else if (livestreams[_livestreamId].active) {
            // If it exists but has default title, allow updating
            bytes memory currentTitle = bytes(livestreams[_livestreamId].title);
            bytes memory defaultPrefix = bytes("Project #");
            
            // Check if current title starts with "Project #" (default title)
            if (currentTitle.length >= defaultPrefix.length) {
                bool isDefault = true;
                for (uint i = 0; i < defaultPrefix.length; i++) {
                    if (currentTitle[i] != defaultPrefix[i]) {
                        isDefault = false;
                        break;
                    }
                }
                
                // Only update if it's still using default title
                if (isDefault) {
                    livestreams[_livestreamId].title = _title;
                    emit LivestreamAdded(_livestreamId, _title);
                }
            }
        }
    }

    function removeLivestream(uint256 _livestreamId) external onlyOracle inState(State.Open) {
        require(livestreams[_livestreamId].active, "Livestream not found or inactive");
        
        // Mark as inactive
        livestreams[_livestreamId].active = false;
        
        // Remove from livestreamIds array
        for (uint256 i = 0; i < livestreamIds.length; i++) {
            if (livestreamIds[i] == _livestreamId) {
                livestreamIds[i] = livestreamIds[livestreamIds.length - 1];
                livestreamIds.pop();
                break;
            }
        }
        
        emit LivestreamRemoved(_livestreamId);
    }

    // Updated betting function - bet on specific livestream
    // Automatically adds livestream to market if it doesn't exist
    function placeBet(uint256 _livestreamId) external payable inState(State.Open) {
        require(msg.value > 0, "Must send ETH");
        require(_livestreamId > 0, "Invalid livestream ID");
        
        // If livestream doesn't exist in market, add it automatically
        if (livestreams[_livestreamId].id == 0) {
            // Auto-add livestream with default title
            string memory defaultTitle = string(abi.encodePacked("Project #", _livestreamId));
            
            livestreams[_livestreamId] = LivestreamData({
                id: _livestreamId,
                title: defaultTitle,
                active: true,
                addedAt: block.timestamp
            });
            
            livestreamIds.push(_livestreamId);
            
            emit LivestreamAdded(_livestreamId, defaultTitle);
        }
        
        // Track new bettor
        if (!hasBet[msg.sender]) {
            hasBet[msg.sender] = true;
            bettors.push(msg.sender);
            totalBettors++;
        }
        
        bets[msg.sender][_livestreamId] += msg.value;
        totalBets[_livestreamId] += msg.value;
        totalPool += msg.value;
        
        emit BetPlaced(msg.sender, _livestreamId, msg.value, block.timestamp);
    }

    function closeMarket() external onlyOracle inState(State.Open) {
        state = State.Closed;
        closedAt = block.timestamp;
        
        // Notify factory about all associated livestreams
        IMarketFactory(factory).notifyMarketClosed(livestreamIds);
        
        emit MarketClosed(block.timestamp);
    }

    // Updated resolution function - specify winning livestream
    function resolveMarket(uint256 _winningLivestreamId) external onlyOracle inState(State.Closed) {
        require(livestreams[_winningLivestreamId].id != 0, "Invalid winning livestream");
        require(totalBets[_winningLivestreamId] > 0, "No bets on this livestream");
        
        winningLivestreamId = _winningLivestreamId;
        state = State.Resolved;
        resolvedAt = block.timestamp;
        
        emit MarketResolved(_winningLivestreamId, block.timestamp);
    }

    function claimPayout() external inState(State.Resolved) {
        uint256 userBet = bets[msg.sender][winningLivestreamId];
        require(userBet > 0, "No winning bet");
        
        uint256 winningPool = totalBets[winningLivestreamId];
        require(winningPool > 0, "No winning bets");
        
        // Calculate payout: user's proportion of winning pool gets proportional share of total pool
        uint256 payout = (userBet * totalPool) / winningPool;
        
        // Reset user's bet to prevent double claiming
        bets[msg.sender][winningLivestreamId] = 0;
        
        // Transfer payout
        (bool success, ) = msg.sender.call{value: payout}("");
        require(success, "Transfer failed");
        
        emit PayoutClaimed(msg.sender, payout, block.timestamp);
    }

    // View functions - Updated to return per-livestream data
    function getMarketInfo() external view returns (
        uint256[] memory _livestreamIds,
        string memory _question,
        string[] memory _livestreamTitles,
        State _state,
        uint256 _winningLivestreamId,
        uint256 _totalPool,
        uint256 _totalBettors,
        uint256 _createdAt,
        uint256 _closedAt,
        uint256 _resolvedAt
    ) {
        // Build arrays from mapping
        string[] memory titles = new string[](livestreamIds.length);
        for (uint256 i = 0; i < livestreamIds.length; i++) {
            titles[i] = livestreams[livestreamIds[i]].title;
        }
        
        return (
            livestreamIds,
            question,
            titles,
            state,
            winningLivestreamId,
            totalPool,
            totalBettors,
            createdAt,
            closedAt,
            resolvedAt
        );
    }

    // New function: Get per-livestream betting data
    function getLivestreamBets(uint256 _livestreamId) external view returns (
        uint256 totalBetsAmount,
        uint256 percentage,
        bool isActive
    ) {
        require(livestreams[_livestreamId].active, "Livestream not active");
        
        uint256 amount = totalBets[_livestreamId];
        uint256 percent = totalPool > 0 ? (amount * 100) / totalPool : 0;
        
        return (amount, percent, livestreams[_livestreamId].active);
    }

    // New function: Get all livestreams with their betting data
    function getAllLivestreamBets() external view returns (
        uint256[] memory _livestreamIds,
        string[] memory _titles,
        uint256[] memory _amounts,
        uint256[] memory _percentages
    ) {
        uint256 activeCount = 0;
        
        // Count active livestreams
        for (uint256 i = 0; i < livestreamIds.length; i++) {
            if (livestreams[livestreamIds[i]].active) {
                activeCount++;
            }
        }
        
        // Build arrays
        uint256[] memory ids = new uint256[](activeCount);
        string[] memory titles = new string[](activeCount);
        uint256[] memory amounts = new uint256[](activeCount);
        uint256[] memory percentages = new uint256[](activeCount);
        
        uint256 index = 0;
        for (uint256 i = 0; i < livestreamIds.length; i++) {
            uint256 livestreamId = livestreamIds[i];
            if (livestreams[livestreamId].active) {
                ids[index] = livestreamId;
                titles[index] = livestreams[livestreamId].title;
                amounts[index] = totalBets[livestreamId];
                percentages[index] = totalPool > 0 ? (amounts[index] * 100) / totalPool : 0;
                index++;
            }
        }
        
        return (ids, titles, amounts, percentages);
    }

    // Helper function: Get user's bets on all livestreams
    function getUserBets(address _user) external view returns (
        uint256[] memory _livestreamIds,
        uint256[] memory _amounts
    ) {
        uint256 activeCount = 0;
        
        // Count active livestreams
        for (uint256 i = 0; i < livestreamIds.length; i++) {
            if (livestreams[livestreamIds[i]].active) {
                activeCount++;
            }
        }
        
        uint256[] memory ids = new uint256[](activeCount);
        uint256[] memory amounts = new uint256[](activeCount);
        
        uint256 index = 0;
        for (uint256 i = 0; i < livestreamIds.length; i++) {
            uint256 livestreamId = livestreamIds[i];
            if (livestreams[livestreamId].active) {
                ids[index] = livestreamId;
                amounts[index] = bets[_user][livestreamId];
                index++;
            }
        }
        
        return (ids, amounts);
    }

    // Helper function: Get livestream data
    function getLivestreamData(uint256 _livestreamId) external view returns (
        uint256 id,
        string memory title,
        bool active,
        uint256 addedAt
    ) {
        LivestreamData memory data = livestreams[_livestreamId];
        return (data.id, data.title, data.active, data.addedAt);
    }
} 