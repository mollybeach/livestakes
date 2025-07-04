// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./PredictionMarket.sol";

contract MarketFactory {
    event MarketDeployed(address indexed marketAddress, string question);

    function deployMarket(string memory question) public returns (address) {
        // In a real implementation, this would deploy a new PredictionMarket contract
        // Deploy new PredictionMarket contract
        PredictionMarket market = new PredictionMarket(question);
        emit MarketDeployed(address(market), question);
        return address(market);
    }

    // Helper function to create a market through the factory
    function createMarket(string memory question) public returns (address) {
        return deployMarket(question);
    }
}