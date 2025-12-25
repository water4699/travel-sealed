import { task } from "hardhat/config";

task("accounts", "Prints the list of accounts with balances", async (_taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  console.log("Available accounts:");
  console.log("===================");

  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i];
    const balance = await hre.ethers.provider.getBalance(account.address);
    const balanceInEth = hre.ethers.formatEther(balance);

    console.log(`${i}: ${account.address} (${balanceInEth} ETH)`);
  }
});
