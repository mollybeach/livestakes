const { ethers } = require('ethers');

async function getProject(contractAddress, projectId) {
    // ABI for the getProject function
    const abi = [
        "function getProject(uint64 id) public view returns (uint64 id, string name, address owner, string description, uint256 createdAt)"
    ];

    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const contract = new ethers.Contract(contractAddress, abi, provider);

    try {
        const project = await contract.getProject(projectId);
        return {
            id: project.id.toString(),
            name: project.name,
            owner: project.owner,
            description: project.description,
            createdAt: new Date(project.createdAt.toNumber() * 1000)
        };
    } catch (error) {
        console.error('Error getting project:', error);
        return null;
    }
}

module.exports = { getProject };