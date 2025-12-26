const { ethers } = require("ethers");

async function main() {
    const provider = new ethers.JsonRpcProvider("http://localhost:8545");
    const inputVerifierAddress = "0x901F8942346f7AB3a01F6D7613119Bca447Bb030";
    const abi = [
        "function eip712Domain() view returns (bytes1 fields, string name, string version, uint256 chainId, address verifyingContract, bytes32 salt, uint256[] extensions)",
        "function getCoprocessorSigners() view returns (address[])"
    ];
    const contract = new ethers.Contract(inputVerifierAddress, abi, provider);
    
    try {
        const domain = await contract.eip712Domain();
        console.log("Domain:", {
            fields: domain.fields,
            name: domain.name,
            version: domain.version,
            chainId: domain.chainId.toString(),
            verifyingContract: domain.verifyingContract,
            salt: domain.salt,
            extensions: domain.extensions.map(e => e.toString())
        });
        
        const signers = await contract.getCoprocessorSigners();
        console.log("Signers:", signers);
    } catch (e) {
        console.error("Error:", e.message);
    }
}

main();

