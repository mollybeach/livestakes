const { ethers } = require('ethers');

async function claimPayout(contractAddress, privateKey) {
    // ABI for the claimPayout function
    const abi = [
        "function claimPayout() external",
        "event PayoutClaimed(address indexed user, uint256 amount, uint256 timestamp)"
    ];

    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    try {
        const tx = await contract.claimPayout();
        const receipt = await tx.wait();
        
        // Parse the PayoutClaimed event
        let event = null;
        if (receipt.events) {
            event = receipt.events.find(e => e.event === 'PayoutClaimed');
        }
        if (event) {
            return {
                user: event.args.user,
                amount: ethers.utils.formatEther(event.args.amount),
                timestamp: event.args.timestamp.toString(),
                transactionHash: receipt.transactionHash
            };
        }

        return {
            transactionHash: receipt.transactionHash,
            status: 'success'
        };
    } catch (error) {
        console.error('Error claiming payout:', error);
        throw error;
    }
}

// Helper function to get potential payout for a user
async function getPotentialPayout(contractAddress, userAddress, side, privateKey) {
    const abi = [
        "function getPotentialPayout(address user, uint8 side) external view returns (uint256)"
    ];

    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    try {
        const payout = await contract.getPotentialPayout(userAddress, side);
        return ethers.utils.formatEther(payout);
    } catch (error) {
        console.error('Error getting potential payout:', error);
        throw error;
    }
}

// Helper function to check if user has winning bets
async function hasWinningBets(contractAddress, userAddress, privateKey) {
    const abi = [
        "function getUserBets(address user) external view returns (uint256 yesBets, uint256 noBets)",
        "function getMarketInfo() external view returns (uint256 _livestreamId, string memory _question, string memory _livestreamTitle, uint8 _state, uint8 _outcome, uint256 _yesBets, uint256 _noBets, uint256 _totalPool, uint256 _totalBettors, uint256 _createdAt, uint256 _closedAt, uint256 _resolvedAt)"
    ];

    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    try {
        const [userBets, marketInfo] = await Promise.all([
            contract.getUserBets(userAddress),
            contract.getMarketInfo()
        ]);

        // Check if market is resolved
        if (marketInfo._state.toString() !== '2') {
            return {
                hasWinningBets: false,
                reason: 'Market not resolved yet'
            };
        }

        const outcome = marketInfo._outcome.toString();
        const winningBet = outcome === '0' ? userBets.yesBets : userBets.noBets;
        
        return {
            hasWinningBets: winningBet.gt(0),
            winningAmount: ethers.utils.formatEther(winningBet),
            outcome: outcome === '0' ? 'Yes' : 'No'
        };
    } catch (error) {
        console.error('Error checking winning bets:', error);
        throw error;
    }
}

module.exports = { claimPayout, getPotentialPayout, hasWinningBets };