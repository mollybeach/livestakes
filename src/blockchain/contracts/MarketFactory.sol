// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./PredictionMarket.sol";

contract MarketFactory {
    address public owner;
    event MarketCreated(address indexed market, uint64 indexed projectId);
    mapping(uint64 => address) public projectMarkets;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createMarket(uint64 projectId, string memory projectName) external onlyOwner returns (address) {
        require(projectMarkets[projectId] == address(0), "Market already exists");
        PredictionMarket market = new PredictionMarket(projectId, projectName, owner);
        projectMarkets[projectId] = address(market);
        emit MarketCreated(address(market), projectId);
        return address(market);
    }

    function getMarket(uint64 projectId) external view returns (address) {
        return projectMarkets[projectId];
    }
}