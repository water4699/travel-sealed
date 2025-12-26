const { ethers } = require("hardhat");

async function main() {
    const inputVerifierAddress = "0x901F8942346f7AB3a01F6D7613119Bca447Bb030";
    const mysteryAddress = "0x9Cd2E6f2583Ba1eb7fEAF21DFd604937Fdf35668";
    
    // Using hardhat to easily get the signer (owner)
    const [owner] = await ethers.getSigners();
    console.log("Owner address:", owner.address);
    
    const InputVerifier = await ethers.getContractAt("InputVerifier", inputVerifierAddress);
    
    try {
        console.log("Adding mystery signer...");
        const tx = await InputVerifier.addSigner(mysteryAddress);
        await tx.wait();
        console.log("Signer added successfully!");
        
        const signers = await InputVerifier.getCoprocessorSigners();
        console.log("Current signers:", signers);
    } catch (e) {
        console.error("Error:", e.message);
    }
}

main();

