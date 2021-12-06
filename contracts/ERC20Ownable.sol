//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/**
 *
 * OWNABLE ERC20
 *
 */

contract ERC20Ownable is Initializable, ERC20Upgradeable, OwnableUpgradeable {
    //===== Public Functions =====//

    function initialize(
        string memory name_,
        string memory symbol_,
        address owner
    ) public initializer {
        __ERC20_init(name_, symbol_);
        __Ownable_init();
        transferOwnership(owner);
    }

    function mint(address account, uint256 amount) public onlyOwner {
        _mint(account, amount);
    }
}
