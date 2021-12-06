//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import {ERC20Ownable} from "./ERC20Ownable.sol";

contract ERC20OwnableFactory {
    //===== State =====//
    address public immutable erc20ownable;

    //===== Events =====//
    event CreateERC20Ownable(
        address address_,
        string name,
        string symbol,
        address owner
    );

    //===== Constructor =====//
    constructor() {
        erc20ownable = address(new ERC20Ownable());
    }

    //===== External Functions =====//
    function createERC20Ownable(
        string memory name,
        string memory symbol,
        address owner
    ) external returns (address) {
        address clone = Clones.clone(erc20ownable);
        ERC20Ownable(clone).initialize(name, symbol, owner);
        emit CreateERC20Ownable(clone, name, symbol, owner);
        return clone;
    }
}
