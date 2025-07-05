// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./PredictionMarket.sol";

contract MarketFactory {
    address public owner;
    
    // Events
    event MarketCreated(address indexed marketAddress, uint256[] livestreamIds, string question);
    event MarketClosed(address indexed marketAddress, uint256[] livestreamIds);
    event LivestreamAddedToMarket(address indexed marketAddress, uint256 indexed livestreamId);
    event LivestreamRemovedFromMarket(address indexed marketAddress, uint256 indexed livestreamId);
    
    // Mappings
    mapping(uint256 => address[]) public livestreamMarkets; // livestreamId => market addresses
    mapping(address => bool) public validMarkets;
    mapping(address => uint256[]) public marketToLivestreams; // market address => livestream IDs
    
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

    // Create a new prediction market for multiple livestreams
    function createMarket(
        uint256[] memory livestreamIds, 
        string memory question,
        string[] memory livestreamTitles
    ) external onlyOwner returns (address) {
        // Allow empty arrays - markets can be created without livestreams
        require(livestreamIds.length == livestreamTitles.length, "Mismatched arrays");
        
        // Create new prediction market
        PredictionMarket market = new PredictionMarket(
            livestreamIds, 
            question, 
            livestreamTitles,
            owner
        );
        
        address marketAddress = address(market);
        
        // Store market info
        validMarkets[marketAddress] = true;
        marketToLivestreams[marketAddress] = livestreamIds;
        allMarkets.push(marketAddress);
        
        // Add market to each livestream's market list (only if there are livestreams)
        for (uint256 i = 0; i < livestreamIds.length; i++) {
            livestreamMarkets[livestreamIds[i]].push(marketAddress);
        }
        
        emit MarketCreated(marketAddress, livestreamIds, question);
        return marketAddress;
    }

    // Add a livestream to an existing market
    function addLivestreamToMarket(
        address marketAddress,
        uint256 livestreamId,
        string memory livestreamTitle
    ) external onlyOwner {
        require(validMarkets[marketAddress], "Invalid market");
        
        // Check if livestream is already in market
        uint256[] memory currentLivestreams = marketToLivestreams[marketAddress];
        for (uint256 i = 0; i < currentLivestreams.length; i++) {
            require(currentLivestreams[i] != livestreamId, "Livestream already in market");
        }
        
        // Add to market contract
        PredictionMarket market = PredictionMarket(marketAddress);
        market.addLivestream(livestreamId, livestreamTitle);
        
        // Update mappings
        marketToLivestreams[marketAddress].push(livestreamId);
        livestreamMarkets[livestreamId].push(marketAddress);
        
        emit LivestreamAddedToMarket(marketAddress, livestreamId);
    }

    // Remove a livestream from a market
    function removeLivestreamFromMarket(
        address marketAddress,
        uint256 livestreamId
    ) external onlyOwner {
        require(validMarkets[marketAddress], "Invalid market");
        
        // Remove from market contract
        PredictionMarket market = PredictionMarket(marketAddress);
        market.removeLivestream(livestreamId);
        
        // Update marketToLivestreams mapping
        uint256[] storage marketLivestreams = marketToLivestreams[marketAddress];
        for (uint256 i = 0; i < marketLivestreams.length; i++) {
            if (marketLivestreams[i] == livestreamId) {
                marketLivestreams[i] = marketLivestreams[marketLivestreams.length - 1];
                marketLivestreams.pop();
                break;
            }
        }
        
        // Update livestreamMarkets mapping
        address[] storage livestreamMarketList = livestreamMarkets[livestreamId];
        for (uint256 i = 0; i < livestreamMarketList.length; i++) {
            if (livestreamMarketList[i] == marketAddress) {
                livestreamMarketList[i] = livestreamMarketList[livestreamMarketList.length - 1];
                livestreamMarketList.pop();
                break;
            }
        }
        
        emit LivestreamRemovedFromMarket(marketAddress, livestreamId);
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

    // Get livestream IDs for a market
    function getLivestreamsForMarket(address marketAddress) external view returns (uint256[] memory) {
        require(validMarkets[marketAddress], "Invalid market");
        return marketToLivestreams[marketAddress];
    }

    // Check if a livestream is in a specific market
    function isLivestreamInMarket(address marketAddress, uint256 livestreamId) external view returns (bool) {
        require(validMarkets[marketAddress], "Invalid market");
        
        uint256[] memory livestreamIds = marketToLivestreams[marketAddress];
        for (uint256 i = 0; i < livestreamIds.length; i++) {
            if (livestreamIds[i] == livestreamId) {
                return true;
            }
        }
        return false;
    }

    // Called by markets when they are closed
    function notifyMarketClosed(uint256[] calldata livestreamIds) external onlyValidMarket {
        emit MarketClosed(msg.sender, livestreamIds);
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