import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("Deploying contracts with deployer:", deployer);

  // Deploy FHECounter first
  const deployedFHECounter = await deploy("FHECounter", {
    from: deployer,
    log: true,
  });

  console.log(`✅ FHECounter deployed at: ${deployedFHECounter.address}`);

  // Deploy EncryptedTripPlanner
  const deployedTripPlanner = await deploy("EncryptedTripPlanner", {
    from: deployer,
    log: true,
  });

  console.log(`✅ EncryptedTripPlanner deployed at: ${deployedTripPlanner.address}`);
  console.log("\n🎉 All contracts deployed successfully!");
};
export default func;
func.id = "deploy_all_contracts"; // id required to prevent reexecution
func.tags = ["FHECounter", "EncryptedTripPlanner", "all"];
