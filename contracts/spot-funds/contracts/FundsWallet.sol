// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol";

abstract contract FundsWallet {
    using SafeERC20 for IERC20;
    using EnumerableSet for EnumerableSet.AddressSet;

    address admin; // Make sure this is assigned in inheriting contracts

    // user => token_address => balance
    mapping(address => mapping(address => uint256)) public balances;
    // list of tokens held by user (user => list of token addresses)
    mapping(address => EnumerableSet.AddressSet) internal user_tokens;

    event TradeLogEvent(
        uint256 tradeLogId,
        address fromWallet,
        address toWallet,
        address fromToken,
        address toToken,
        uint256 fromAmount,
        uint256 toAmount);
    event BalanceUpdateEvent(uint256 tradeLogId, address user, address token, uint256 amount);
    event DepositEvent(address user, address token, uint256 amount);
    event WithdrawEvent(address user, address token, uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    function getTokens(address user) public view returns (address[] memory) {
        return user_tokens[user].values();
    }

    function getBalance(address user, address token) public view returns (uint256) {
        return balances[user][token];
    }

    function deposit(address token, uint256 amount) external {
        // Deposit funds to the contract
        address user = msg.sender;

        // call transferFrom on token contract
        IERC20(token).safeTransferFrom(user, address(this), amount);

        // update balances struct
        balances[user][token] += amount;

        // should update user_tokens
        user_tokens[user].add(token);

        // On deposit it should emit a deposit event
        emit DepositEvent(user, token, amount);
    }

    function withdraw(address user, address token, uint256 amount) external onlyAdmin {
        // Withdraw funds from the contract
        // Withdraw is processed by admin

        require(balances[user][token] >= amount, "Insufficient balance");
        balances[user][token] -= amount;
        IERC20(token).approve(address(this), amount);
        IERC20(token).safeTransfer(user, amount);

        // On withdraw it should emit a withdraw event
        emit WithdrawEvent(user, token, amount);
    }

    function updateBalances(
        uint256 tradeLogId,
        address fromWallet,
        address toWallet,
        address fromToken, // HARU
        address toToken, // HUSD
        uint256 fromAmount, // 100
        uint256 toAmount // 50
    ) external onlyAdmin {
        // On update balance it should emit a balance update event
        // address fromWallet, -HARU for user 1 + HUSD for user 2
        // address toWallet, +HARU for user 2 - HUSD for user 2


        // from wallet
        balances[fromWallet][fromToken] -= fromAmount; // -HARU
        balances[fromWallet][toToken] += toAmount; // +HUSD
        user_tokens[fromWallet].add(toToken);

        // to wallet
        balances[toWallet][fromToken] += fromAmount; // +HARU
        balances[toWallet][toToken] -= toAmount; // -HUSD
        user_tokens[toWallet].add(fromToken);

        emit TradeLogEvent(tradeLogId, fromWallet, toWallet, fromToken, toToken, fromAmount, toAmount);
        emit BalanceUpdateEvent(tradeLogId, fromWallet, fromToken, fromAmount);
        emit BalanceUpdateEvent(tradeLogId, toWallet, toToken, toAmount);
    }

    fallback() external {
        // fallback of default account shouldn't be called by bootloader under no circumstances
        assert(msg.sender != BOOTLOADER_FORMAL_ADDRESS);
        // If the contract is called directly, behave like an EOA
    }

    receive() external payable {
        // If the contract is called directly, behave like an EOA.
        // Note, that is okay if the bootloader sends funds with no calldata as it may be used for refunds/operator payments
    }
}
