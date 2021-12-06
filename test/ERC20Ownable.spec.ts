import { BigNumber } from "@ethersproject/bignumber";
import { parseEther } from "@ethersproject/units";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect, assert } from "chai";
import { ethers } from "hardhat";
import { ERC20Ownable } from "../typechain/ERC20Ownable";
import { ERC20OwnableFactory } from "../typechain/ERC20OwnableFactory";
import {
  ERC20OwnableFactory__factory,
  ERC20Ownable__factory,
} from "../typechain";
import { randomBytes } from "ethers/lib/utils";

const { AddressZero } = ethers.constants;

/**
 * TODO
 *
 * factory deploys a contract
 * deployed contract supports erc20 interface
 * deployed contract lets owner mint
 * deployed contract doesn't let non-owners mint
 *
 */

describe("ERC20Ownable", () => {
  let accounts: SignerWithAddress[];
  let ownerAddr: string;
  let factory: ERC20OwnableFactory;
  let name: string;
  let symbol: string;
  let erc20: ERC20Ownable;
  let erc20WrongOwner: ERC20Ownable;

  before(async () => {
    accounts = await ethers.getSigners();
    const fFactory = new ERC20OwnableFactory__factory(accounts[0]);
    factory = await fFactory.deploy();
    await factory.deployed();
    ownerAddr = await accounts[1].getAddress();
    [name, symbol] = ["Token", "TKN"];
    const res = await factory.createERC20Ownable(name, symbol, ownerAddr);
    const rec = await res.wait();
    if (!rec.events) throw new Error("No events");
    const createERC20 = rec.events[2];
    assert.equal(createERC20.args?.name, name, "name");
    assert.equal(createERC20.args?.symbol, symbol, "symbol");
    assert.equal(createERC20.args?.owner, ownerAddr, "owner");
    const eFactory = new ERC20Ownable__factory(accounts[1]);
    erc20 = eFactory.attach(createERC20.args?.address_);
    erc20WrongOwner = erc20.connect(await accounts[2].getAddress());
  });

  it("supports the ERC20 interface", async () => {
    const name_ = await erc20.name();
    assert.equal(name_, name, "name");
    const symbol_ = await erc20.symbol();
    assert.equal(symbol_, symbol, "symbol");
    const balance = await erc20.balanceOf(ownerAddr);
    assert.deepEqual(balance, BigNumber.from("0"), "balance");
  });

  it("lets the owner mint tokens", async () => {
    const address = await accounts[3].getAddress();
    const balance1 = await erc20.balanceOf(address);
    const amount = parseEther("1");
    await erc20.mint(address, amount);
    const balance2 = await erc20.balanceOf(address);
    assert.deepEqual(balance1.add(amount), balance2, "balance");
  });

  it("doesn't let non-owners mint tokens", async () => {
    await expect(
      erc20WrongOwner.mint(ownerAddr, parseEther("2"))
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });
});
