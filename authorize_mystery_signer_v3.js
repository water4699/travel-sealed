const { ethers } = require("ethers");

async function main() {
    const provider = new ethers.JsonRpcProvider("http://localhost:8545");
    const inputVerifierAddress = "0x901F8942346f7AB3a01F6D7613119Bca447Bb030";
    const mysteryAddress = "0x9Cd2E6f2583Ba1eb7fEAF21DFd604937Fdf35668";
    
    // Account #0 is usually the owner
    const ownerPk = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
    const owner = new ethers.Wallet(ownerPk, provider);
    
    const abi = [
        "function addSigner(address signer) external",
        "function getCoprocessorSigners() view returns (address[])",
        "function owner() view returns (address)"
    ];
    
    const contract = new ethers.Contract(inputVerifierAddress, abi, owner);
    
    try {
        console.log("Owner address:", owner.address);
        console.log("Contract owner:", await contract.owner());
        
        console.log("Adding mystery signer...");
        const tx = await contract.addSigner(mysteryAddress);
        await tx.wait();
        console.log("Signer added successfully!");
        
        const signers = await contract.getCoprocessorSigners();
        console.log("Current signers:", signers);
    } catch (e) {
        console.error("Error:", e.message);
    }
}

main();

