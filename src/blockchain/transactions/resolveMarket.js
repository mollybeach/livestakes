const { ethers } = require('ethers');

async function resolveMarket(contractAddress, outcome, privateKey) {
    // ABI for the resolveMarket function
    const abi = [
        "function resolveMarket(uint8 outcome) external",
        "function closeMarket() external",
        "event MarketClosed(uint256 timestamp)",
        "event MarketResolved(uint8 outcome, uint256 timestamp)"
    ];

    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    try {
        // First close the market
        const closeTx = await contract.closeMarket();
        const closeReceipt = await closeTx.wait();
        
        // Then resolve the market
        const resolveTx = await contract.resolveMarket(outcome);
        const resolveReceipt = await resolveTx.wait();

        // Parse the MarketResolved event
        let event = null;
        if (resolveReceipt.events) {
            event = resolveReceipt.events.find(e => e.event === 'MarketResolved');
        }
        if (event) {
            return {
                outcome: event.args.outcome.toString(),
                timestamp: event.args.timestamp.toString(),
                closeTransactionHash: closeReceipt.transactionHash,
                resolveTransactionHash: resolveReceipt.transactionHash
            };
        }

        return {
            closeTransactionHash: closeReceipt.transactionHash,
            resolveTransactionHash: resolveReceipt.transactionHash,
            status: 'success'
        };
    } catch (error) {
        console.error('Error resolving market:', error);
        throw error;
    }
}

// Helper function to just close market without resolving
async function closeMarket(contractAddress, privateKey) {
    const abi = [
        "function closeMarket() external",
        "event MarketClosed(uint256 timestamp)"
    ];

    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    try {
        const tx = await contract.closeMarket();
        const receipt = await tx.wait();

        let event = null;
        if (receipt.events) {
            event = receipt.events.find(e => e.event === 'MarketClosed');
        }
        if (event) {
            return {
                timestamp: event.args.timestamp.toString(),
                transactionHash: receipt.transactionHash
            };
        }

        return {
            transactionHash: receipt.transactionHash,
            status: 'success'
        };
    } catch (error) {
        console.error('Error closing market:', error);
        throw error;
    }
}

// Helper function to get market information
async function getMarketInfo(contractAddress, privateKey) {
    const abi = [
        "function getMarketInfo() external view returns (uint256 _livestreamId, string memory _question, string memory _livestreamTitle, uint8 _state, uint8 _outcome, uint256 _yesBets, uint256 _noBets, uint256 _totalPool, uint256 _totalBettors, uint256 _createdAt, uint256 _closedAt, uint256 _resolvedAt)"
    ];

    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    try {
        const info = await contract.getMarketInfo();
        return {
            livestreamId: info._livestreamId.toString(),
            question: info._question,
            livestreamTitle: info._livestreamTitle,
            state: info._state.toString(), // 0: Open, 1: Closed, 2: Resolved
            outcome: info._outcome.toString(),
            yesBets: ethers.utils.formatEther(info._yesBets),
            noBets: ethers.utils.formatEther(info._noBets),
            totalPool: ethers.utils.formatEther(info._totalPool),
            totalBettors: info._totalBettors.toString(),
            createdAt: info._createdAt.toString(),
            closedAt: info._closedAt.toString(),
            resolvedAt: info._resolvedAt.toString()
        };
    } catch (error) {
        console.error('Error getting market info:', error);
        throw error;
    }
}

module.exports = { resolveMarket, closeMarket, getMarketInfo };