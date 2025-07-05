const { ethers } = require('ethers');

async function registerProject(contractAddress, name, description, privateKey) {
    // ABI for the registerProject function
    const abi = [
        "function registerProject(string memory name, string memory description) public returns (uint64)"
    ];

    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    try {
        const tx = await contract.registerProject(name, description);
        const receipt = await tx.wait();

        // Parse the ProjectRegistered event
        let event = null;
        if (receipt.events) {
            event = receipt.events.find(e => e.event === 'ProjectRegistered');
        }
        if (event) {
            return {
                projectId: event.args.id.toString(),
                name: event.args.name,
                owner: event.args.owner,
                transactionHash: receipt.transactionHash
            };
        }

        return {
            transactionHash: receipt.transactionHash,
            status: 'success'
        };
    } catch (error) {
        console.error('Error registering project:', error);
        throw error;
    }
}

module.exports = { registerProject };