const { ethers } = require('ethers');

async function getMarket(contractAddress, marketId) {
    // ABI for the getMarket function
    const abi = [
        "function getMarket(uint64 id) public view returns (uint64 marketId, string question, address creator, bool isOpen, string outcome, uint256 totalYesBets, uint256 totalNoBets)"
    ];

    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const contract = new ethers.Contract(contractAddress, abi, provider);

    try {
        const market = await contract.getMarket(marketId);
        return {
            id: market.marketId.toString(),
            question: market.question,
            creator: market.creator,
            isOpen: market.isOpen,
            outcome: market.outcome,
            totalYesBets: market.totalYesBets.toString(),
            totalNoBets: market.totalNoBets.toString()
        };
    } catch (error) {
        console.error('Error getting market:', error);
        return null;
    }
}

async function getUserBet(contractAddress, marketId, userAddress, outcome) {
    // ABI for the getUserBet function
    const abi = [
        "function getUserBet(uint64 marketId, address user, string outcome) public view returns (uint256)"
    ];

    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const contract = new ethers.Contract(contractAddress, abi, provider);

    try {
        const bet = await contract.getUserBet(marketId, userAddress, outcome);
        return bet.toString();
    } catch (error) {
        console.error('Error getting user bet:', error);
        return "0";
    }
}

module.exports = { getMarket, getUserBet };