// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./PredictionMarket.sol";

contract MarketFactory {
    address public owner;
    
    // Events
    event MarketCreated(address indexed marketAddress, uint256 indexed livestreamId, string question);
    event MarketClosed(address indexed marketAddress, uint256 indexed livestreamId);
    
    // Mappings
    mapping(uint256 => address[]) public livestreamMarkets; // livestreamId => market addresses
    mapping(address => bool) public validMarkets;
    mapping(address => uint256) public marketToLivestream; // market address => livestream ID
    
    // Arrays for enumeration
    address[] public allMarkets;
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    modifier onlyValidMarket() {
        require(validMarkets[msg.sender], "Not a valid market");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Create a new prediction market for a livestream
    function createMarket(
        uint256 livestreamId, 
        string memory question,
        string memory livestreamTitle
    ) external onlyOwner returns (address) {
        
        // Create new prediction market
        PredictionMarket market = new PredictionMarket(
            livestreamId, 
            question, 
            livestreamTitle,
            owner
        );
        
        address marketAddress = address(market);
        
        // Store market info
        livestreamMarkets[livestreamId].push(marketAddress);
        validMarkets[marketAddress] = true;
        marketToLivestream[marketAddress] = livestreamId;
        allMarkets.push(marketAddress);
        
        emit MarketCreated(marketAddress, livestreamId, question);
        return marketAddress;
    }

    // Get all markets for a specific livestream
    function getMarketsForLivestream(uint256 livestreamId) external view returns (address[] memory) {
        return livestreamMarkets[livestreamId];
    }

    // Get market count for a livestream
    function getMarketCountForLivestream(uint256 livestreamId) external view returns (uint256) {
        return livestreamMarkets[livestreamId].length;
    }

    // Get total number of markets
    function getTotalMarketCount() external view returns (uint256) {
        return allMarkets.length;
    }

    // Get all markets (paginated)
    function getAllMarkets(uint256 offset, uint256 limit) external view returns (address[] memory) {
        require(offset < allMarkets.length, "Offset out of bounds");
        
        uint256 end = offset + limit;
        if (end > allMarkets.length) {
            end = allMarkets.length;
        }
        
        address[] memory result = new address[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            result[i - offset] = allMarkets[i];
        }
        
        return result;
    }

    // Get livestream ID for a market
    function getLivestreamForMarket(address marketAddress) external view returns (uint256) {
        require(validMarkets[marketAddress], "Invalid market");
        return marketToLivestream[marketAddress];
    }

    // Called by markets when they are closed
    function notifyMarketClosed(uint256 livestreamId) external onlyValidMarket {
        emit MarketClosed(msg.sender, livestreamId);
    }

    // Owner functions
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }

    // Check if a market exists
    function isValidMarket(address marketAddress) external view returns (bool) {
        return validMarkets[marketAddress];
    }
}