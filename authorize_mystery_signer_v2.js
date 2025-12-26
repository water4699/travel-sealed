const { ethers } = require("hardhat");

async function main() {
    const inputVerifierAddress = "0x901F8942346f7AB3a01F6D7613119Bca447Bb030";
    const mysteryAddress = "0x9Cd2E6f2583Ba1eb7fEAF21DFd604937Fdf35668";
    
    const abi = [
        "function addSigner(address signer) external",
        "function getCoprocessorSigners() view returns (address[])",
        "function owner() view returns (address)"
    ];
    
    const [owner] = await ethers.getSigners();
    console.log("Owner address:", owner.address);
    
    const contract = new ethers.Contract(inputVerifierAddress, abi, owner);
    
    try {
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

