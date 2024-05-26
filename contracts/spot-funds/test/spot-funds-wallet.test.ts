import { expect } from 'chai';
import { getWallet, deployContract, LOCAL_RICH_WALLETS } from '../deploy/utils';
import { Contract, Wallet } from 'zksync-ethers';
import * as hre from 'hardhat';
import { ethers } from 'ethers';
import { Artifact } from 'hardhat/types';

async function approveTransaction({
  contractAddress,
  artifact,
  wallet,
  toAddress,
  amount,
}: {
  contractAddress: string;
  artifact: Artifact;
  wallet: Wallet;
  toAddress: string;
  amount: number;
}) {
  const contract = new ethers.Contract(contractAddress, artifact.abi, wallet);

  const approvalTx = await contract.approve(toAddress, amount);
  await approvalTx.wait();
}

describe('Spot Funds Wallet', function () {
  const deployerWallet = getWallet(LOCAL_RICH_WALLETS[0].privateKey);
  const userWallet1 = getWallet(LOCAL_RICH_WALLETS[1].privateKey);
  const userWallet2 = getWallet(LOCAL_RICH_WALLETS[2].privateKey);

  let spotFundsContract: Contract;
  let haruTokenContract: Contract;
  let hUSDTokenContract: Contract;
  let spotFundsContractAddress: string;
  let haruTokenContractAddress: string;
  let hUSDTokenContractAddress: string;
  let spotFundsWalletContractArtifacts: Artifact;
  let haruTokenContractArtifacts: Artifact;
  let hUSDTokenContractArtifacts: Artifact;

  before(async () => {
    spotFundsContract = await deployContract(
      'SpotFundsWallet',
      [deployerWallet.address],
      {
        wallet: deployerWallet,
        silent: true,
      },
    );

    haruTokenContract = await deployContract('HaruToken', [], {
      wallet: deployerWallet,
      silent: true,
    });

    hUSDTokenContract = await deployContract('HUSDToken', [], {
      wallet: deployerWallet,
      silent: true,
    });

    spotFundsContractAddress = await spotFundsContract.getAddress();
    haruTokenContractAddress = await haruTokenContract.getAddress();
    hUSDTokenContractAddress = await hUSDTokenContract.getAddress();

    spotFundsWalletContractArtifacts =
      await hre.artifacts.readArtifact('SpotFundsWallet');

    haruTokenContractArtifacts = await hre.artifacts.readArtifact('HaruToken');

    const haruContractForUser1 = new ethers.Contract(
      haruTokenContractAddress,
      haruTokenContractArtifacts.abi,
      userWallet1,
    );

    const mintHaruTx = await haruContractForUser1.mintMe(10000000);
    await mintHaruTx.wait();
    await mintHaruTx.wait();

    hUSDTokenContractArtifacts = await hre.artifacts.readArtifact('HUSDToken');

    const hUSDContractForUser1 = new ethers.Contract(
      hUSDTokenContractAddress,
      hUSDTokenContractArtifacts.abi,
      userWallet1,
    );

    const mintHUSDForUser1 = await hUSDContractForUser1.mintMe(10000000);
    await mintHUSDForUser1.wait();
    await mintHUSDForUser1.wait();

    const hUSDContractForUser2 = new ethers.Contract(
      hUSDTokenContractAddress,
      hUSDTokenContractArtifacts.abi,
      userWallet2,
    );

    const mintHUSDForUser2 = await hUSDContractForUser2.mintMe(10000000);
    await mintHUSDForUser2.wait();
    await mintHUSDForUser2.wait();

    console.log('Contract deployed: ', await spotFundsContract.getAddress());
    console.log('Haru token deployed: ', await haruTokenContract.getAddress());
    console.log('HUSD token deployed: ', await hUSDTokenContract.getAddress());

    console.log(
      'User HARU token balance: ',
      await haruTokenContract.balanceOf(userWallet1.address),
    );
    console.log(
      'User HUSD token balance: ',
      await hUSDTokenContract.balanceOf(userWallet1.address),
    );
  });

  describe('deploy', async () => {
    it('should be able access contract methods', async () => {
      expect(spotFundsContract).to.have.property('deposit');
      expect(spotFundsContract).to.have.property('withdraw');
      expect(spotFundsContract).to.have.property('updateBalances');
      expect(spotFundsContract).to.have.property('getTokens');
      expect(spotFundsContract).to.have.property('getBalance');
    });
  });

  describe('deposit', async () => {
    it('should be able to deposit tokens', async () => {
      const amount = 10000;

      const spotFundsContract = new ethers.Contract(
        spotFundsContractAddress,
        spotFundsWalletContractArtifacts.abi,
        userWallet1,
      );

      const haruTokenContract = new ethers.Contract(
        haruTokenContractAddress,
        haruTokenContractArtifacts.abi,
        userWallet1,
      );

      const balanceOnTokenInitial = await haruTokenContract.balanceOf(
        userWallet1.address,
      );
      //
      // const approvalTx = await haruTokenContract.approve(
      //   spotFundsContractAddress,
      //   amount,
      // );
      // await approvalTx.wait();

      await approveTransaction({
        contractAddress: haruTokenContractAddress,
        artifact: haruTokenContractArtifacts,
        wallet: userWallet1,
        toAddress: spotFundsContractAddress,
        amount: amount,
      });

      const depositTx = await spotFundsContract.deposit(
        haruTokenContractAddress,
        amount,
      );
      await depositTx.wait();

      const balance = await spotFundsContract.getBalance(
        userWallet1.address,
        haruTokenContractAddress,
      );

      expect(balance.toString()).to.eq(amount.toString());

      const userTokens = await spotFundsContract.getTokens(userWallet1.address);
      expect(userTokens.length).to.eq(1);
      expect(userTokens[0]).to.eq(haruTokenContractAddress);

      const balanceOnTokenFinal = await haruTokenContract.balanceOf(
        userWallet1.address,
      );

      expect((balanceOnTokenInitial - balanceOnTokenFinal).toString()).to.eq(
        amount.toString(),
      );
    });
  });

  describe('withdraw', async () => {
    it('should be able to withdraw tokens', async () => {
      // NOTE: 10,000 was deposited earlier in the deposit test

      const balanceOnTokenInitial = await haruTokenContract.balanceOf(
        userWallet1.address,
      );
      const amount = 5000;

      const spotFundsContract = new ethers.Contract(
        spotFundsContractAddress,
        spotFundsWalletContractArtifacts.abi,
        deployerWallet,
      );

      const withdrawTx = await spotFundsContract.withdraw(
        userWallet1.address,
        haruTokenContractAddress,
        amount,
      );
      await withdrawTx.wait();

      const balance: bigint = await spotFundsContract.getBalance(
        userWallet1.address,
        haruTokenContractAddress,
      );
      expect(balance).to.equal(BigInt(5000));

      const balanceOnTokenFinal = await haruTokenContract.balanceOf(
        userWallet1.address,
      );

      const _amount = BigInt(amount);
      expect((_amount + balanceOnTokenInitial).toString()).to.eq(
        balanceOnTokenFinal.toString(),
      );
    });
  });

  describe('balance update', async () => {
    it('should be able to update balances for trade log events', async () => {
      // deposit HUSD in user 2, swap USD for HARU in user 1, user 2 should have HARU at end

      const HUSD_AMOUNT = 1000;

      const spotFundsContract = new ethers.Contract(
        spotFundsContractAddress,
        spotFundsWalletContractArtifacts.abi,
        deployerWallet,
      );

      const spotFundsContractForUser2 = new ethers.Contract(
        spotFundsContractAddress,
        spotFundsWalletContractArtifacts.abi,
        userWallet2,
      );

      const hUSDTokenContract = new ethers.Contract(
        hUSDTokenContractAddress,
        hUSDTokenContractArtifacts.abi,
        userWallet2,
      );

      const husdBalance = await hUSDTokenContract.balanceOf(
        userWallet2.address,
      );
      console.log('HUSD balance for user 2: ', husdBalance.toString());

      const approvalTx = await hUSDTokenContract.approve(
        spotFundsContractAddress,
        HUSD_AMOUNT,
      );
      await approvalTx.wait();

      const depositTx = await spotFundsContractForUser2.deposit(
        hUSDTokenContractAddress,
        HUSD_AMOUNT,
      );
      await depositTx.wait();

      const husdBalanceUser2BeforeTx = await spotFundsContract.getBalance(
        userWallet2.address,
        hUSDTokenContractAddress,
      );
      console.log(
        'HUSD balance in spot funds wallet for user 2 (before tx): ',
        husdBalanceUser2BeforeTx.toString(),
      );
      expect(husdBalanceUser2BeforeTx.toString()).to.eq(HUSD_AMOUNT.toString());

      const updateBalancesTx = await spotFundsContract.updateBalances(
        Date.now(), // uint256 tradeLogId,
        userWallet1.address, // address fromWallet, -HARU for user 1 + HUSD for user 2
        userWallet2.address, // address toWallet, +HARU for user 2 - HUSD for user 2
        haruTokenContractAddress, // address fromToken,
        hUSDTokenContractAddress, // address toToken,
        100, // uint256 fromAmount, => -100 HARU
        50, // uint256 toAmount => +50 HUSD
      );
      await updateBalancesTx.wait();

      const haruBalanceUser2AfterTx = await spotFundsContract.getBalance(
        userWallet2.address,
        haruTokenContractAddress,
      );

      const husdBalanceUser2AfterTx = await spotFundsContract.getBalance(
        userWallet2.address,
        hUSDTokenContractAddress,
      );

      console.log(
        'HARU balance in spot funds wallet for user 2: ',
        haruBalanceUser2AfterTx.toString(),
      );

      console.log(
        'HUSD balance in spot funds wallet for user 2: ',
        husdBalanceUser2AfterTx.toString(),
      );

      const haruBalanceUser1AfterTx = await spotFundsContract.getBalance(
        userWallet1.address,
        haruTokenContractAddress,
      );

      const husdBalanceUser1AfterTx = await spotFundsContract.getBalance(
        userWallet1.address,
        hUSDTokenContractAddress,
      );

      console.log(
        'HARU balance in spot funds wallet for user 1: ',
        haruBalanceUser1AfterTx.toString(),
      );

      console.log(
        'HUSD balance in spot funds wallet for user 1: ',
        husdBalanceUser1AfterTx.toString(),
      );

      expect(haruBalanceUser2AfterTx.toString()).to.eq('100');
      expect(husdBalanceUser2AfterTx.toString()).to.eq('950');
      expect(haruBalanceUser1AfterTx.toString()).to.eq('4900');
      expect(husdBalanceUser1AfterTx.toString()).to.eq('50');
    });
  });
});
