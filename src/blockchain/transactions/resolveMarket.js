const { ethers } = require('ethers');

async function resolveMarket(contractAddress, marketId, outcome, privateKey) {
    // ABI for the resolveMarket function
    const abi = [
        "function resolveMarket(uint64 marketId, string memory outcome) public"
    ];

    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    try {
        const tx = await contract.resolveMarket(marketId, outcome);
        const receipt = await tx.wait();

        // Parse the MarketResolved event
        let event = null;
        if (receipt.events) {
            event = receipt.events.find(e => e.event === 'MarketResolved');
        }
        if (event) {
            return {
                marketId: event.args.id.toString(),
                outcome: event.args.outcome,
                transactionHash: receipt.transactionHash
            };
        }

        return {
            transactionHash: receipt.transactionHash,
            status: 'success'
        };
    } catch (error) {
        console.error('Error resolving market:', error);
        throw error;
    }
}

module.exports = { resolveMarket };