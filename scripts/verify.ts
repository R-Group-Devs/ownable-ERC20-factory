import hre from "hardhat";
import { readFileSync } from "fs";
import { keccak256 } from "@ethersproject/keccak256";
import { ERC20OwnableFactory__factory } from "../typechain";
import { Deployment } from "./types";

async function main() {
  const deployments = JSON.parse(
    readFileSync(`${__dirname}/../deployments/${hre.network.name}.json`, "utf8")
  );
  const byteHash = keccak256(ERC20OwnableFactory__factory.bytecode);
  const deployment: Deployment = deployments[byteHash];
  await hre.run("verify:verify", {
    address: deployment.factory,
    constructorArguments: [],
  });
  await hre.run("verify:verify", {
    address: deployment.erc20ownable,
    constructorArguments: [],
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
