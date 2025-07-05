const { ethers } = require('ethers');

async function placeBet(contractAddress, marketId, outcome, amount, privateKey) {
    // ABI for the placeBet function
    const abi = [
        "function placeBet(uint64 marketId, string memory outcome, uint256 amount) public"
    ];

    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    try {
        const tx = await contract.placeBet(marketId, outcome, amount);
        const receipt = await tx.wait();

        // Parse the BetPlaced event
        let event = null;
        if (receipt.events) {
            event = receipt.events.find(e => e.event === 'BetPlaced');
        }
        if (event) {
            return {
                marketId: event.args.marketId.toString(),
                user: event.args.user,
                outcome: event.args.outcome,
                amount: event.args.amount.toString(),
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

module.exports = { placeBet };