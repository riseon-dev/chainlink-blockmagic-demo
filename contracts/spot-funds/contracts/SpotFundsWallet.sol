// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import { FundsWallet } from "./FundsWallet.sol";

contract SpotFundsWallet is FundsWallet {
    using SafeERC20 for IERC20;

    constructor(address _admin) {
        admin = _admin;
    }
}

