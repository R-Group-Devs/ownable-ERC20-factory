import { ethers, network } from "hardhat";
import { readFileSync, writeFileSync } from "fs";
import { keccak256 } from "@ethersproject/keccak256";
import { ERC20OwnableFactory__factory } from "../typechain";
import { ERC20OwnableFactory } from "../typechain/ERC20OwnableFactory";
import { Deployment } from "./types";

async function main() {
  const accounts = await ethers.getSigners();
  const deployments: { [byteHash: string]: Deployment } = JSON.parse(
    readFileSync(`${__dirname}/../deployments/${network.name}.json`, "utf8")
  );
  const factory = new ERC20OwnableFactory__factory(accounts[0]);
  const byteHash = keccak256(ERC20OwnableFactory__factory.bytecode);
  const erc20Factory: ERC20OwnableFactory = await factory.deploy();
  await erc20Factory.deployed();
  const erc20OwnableAddr = await erc20Factory.erc20ownable();
  deployments[byteHash] = {
    factory: erc20Factory.address,
    erc20ownable: erc20OwnableAddr,
  };
  writeFileSync(
    `${__dirname}/../deployments/${network.name}.json`,
    JSON.stringify(deployments)
  );
  console.log(
    `🚀 MembershipsFactory has been deployed to: ${erc20Factory.address}`
  );
  console.log(`🚀 Memberships has been deployed to: ${erc20OwnableAddr}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
