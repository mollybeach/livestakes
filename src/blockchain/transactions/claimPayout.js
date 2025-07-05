const { ethers } = require('ethers');

async function claimPayout(contractAddress, marketId, privateKey) {
    // ABI for the claimPayout function
    const abi = [
        "function claimPayout(uint64 marketId) public"
    ];

    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    try {
        const tx = await contract.claimPayout(marketId);
        const receipt = await tx.wait();
        // Parse the PayoutClaimed event
        let event = null;
        if (receipt.events) {
            event = receipt.events.find(e => e.event === 'PayoutClaimed');
        }
        if (event) {
            return {
                marketId: event.args.marketId.toString(),
                user: event.args.user,
                amount: event.args.amount.toString(),
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

module.exports = { claimPayout };