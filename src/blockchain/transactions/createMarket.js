const { ethers } = require('ethers');

async function createMarket(contractAddress, livestreamId, question, livestreamTitle, privateKey) {
    // ABI for the createMarket function
    const abi = [
        "function createMarket(uint256 livestreamId, string memory question, string memory livestreamTitle) external returns (address)"
    ];

    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    try {
        const tx = await contract.createMarket(livestreamId, question, livestreamTitle);
        const receipt = await tx.wait();

        // Parse the MarketCreated event
        let event = null;
        if (receipt.events) {
            event = receipt.events.find(e => e.event === 'MarketCreated');
        }
        if (event) {
            return {
                marketAddress: event.args.marketAddress,
                livestreamId: event.args.livestreamId.toString(),
                question: event.args.question,
                transactionHash: receipt.transactionHash
            };
        }

        return {
            transactionHash: receipt.transactionHash,
            status: 'success'
        };
    } catch (error) {
        console.error('Error creating market:', error);
        throw error;
    }
}

// Helper function to get markets for a specific livestream
async function getMarketsForLivestream(contractAddress, livestreamId, privateKey) {
    const abi = [
        "function getMarketsForLivestream(uint256 livestreamId) external view returns (address[] memory)"
    ];

    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    try {
        const markets = await contract.getMarketsForLivestream(livestreamId);
        return markets;
    } catch (error) {
        console.error('Error getting markets for livestream:', error);
        throw error;
    }
}

module.exports = { createMarket, getMarketsForLivestream };