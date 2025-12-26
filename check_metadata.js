const { ethers } = require("ethers");

async function main() {
    const provider = new ethers.JsonRpcProvider("http://localhost:8545");
    try {
        const metadata = await provider.send("fhevm_relayer_metadata", []);
        console.log("Metadata:", metadata);
    } catch (e) {
        console.error("Error:", e.message);
    }
}

main();

