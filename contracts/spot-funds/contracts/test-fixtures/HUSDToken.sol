// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract HUSDToken is ERC20 {
    constructor() ERC20("HUSDStableCoin", "HUSD") {
        _mint(msg.sender, 1000000 * (10 ** uint256(decimals())));
    }

    function mintMe(uint256 amount) public {
        _mint(msg.sender, amount);
    }
}
