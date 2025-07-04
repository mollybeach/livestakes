const { ethers } = require('ethers');

async function createMarket(contractAddress, question, privateKey) {
    // ABI for the createMarket function
    const abi = [
        "function createMarket(string memory question) public returns (uint64)"
    ];

    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    try {
        const tx = await contract.createMarket(question);
        const receipt = await tx.wait();

        // Parse the MarketCreated event
        let event = null;
        if (receipt.events) {
            event = receipt.events.find(e => e.event === 'MarketCreated');
        }
        if (event) {
            return {
                marketId: event.args.id.toString(),
                question: event.args.question,
                creator: event.args.creator,
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

module.exports = { createMarket };