const { ethers } = require('ethers');

async function placeBet(contractAddress, side, betAmount, privateKey) {
    // ABI for the placeBet function
    const abi = [
        "function placeBet(uint8 side) external payable",
        "event BetPlaced(address indexed user, uint8 side, uint256 amount, uint256 timestamp)"
    ];

    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    try {
        // side: 0 = Yes, 1 = No
        const tx = await contract.placeBet(side, {
            value: ethers.utils.parseEther(betAmount.toString())
        });
        const receipt = await tx.wait();

        // Parse the BetPlaced event
        let event = null;
        if (receipt.events) {
            event = receipt.events.find(e => e.event === 'BetPlaced');
        }
        if (event) {
            return {
                user: event.args.user,
                side: event.args.side.toString(),
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
        console.error('Error placing bet:', error);
        throw error;
    }
}

// Helper function to get user's bets
async function getUserBets(contractAddress, userAddress, privateKey) {
    const abi = [
        "function getUserBets(address user) external view returns (uint256 yesBets, uint256 noBets)"
    ];

    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    try {
        const bets = await contract.getUserBets(userAddress);
        return {
            yesBets: ethers.utils.formatEther(bets.yesBets),
            noBets: ethers.utils.formatEther(bets.noBets)
        };
    } catch (error) {
        console.error('Error getting user bets:', error);
        throw error;
    }
}

// Helper function to get market odds
async function getMarketOdds(contractAddress, privateKey) {
    const abi = [
        "function getOdds() external view returns (uint256 yesOdds, uint256 noOdds)"
    ];

    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    try {
        const odds = await contract.getOdds();
        return {
            yesOdds: odds.yesOdds.toString(),
            noOdds: odds.noOdds.toString()
        };
    } catch (error) {
        console.error('Error getting market odds:', error);
        throw error;
    }
}

module.exports = { placeBet, getUserBets, getMarketOdds };