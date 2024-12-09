const { ethers } = require("hardhat");

async function main() {

    const btc24h = await ethers.getContractFactory("btc24h");

const Btc24h = await btc24h.deploy();

await Btc24h.waitForDeployment()
const Btc24hAddress = await Btc24h.getAddress();

console.log("Btc24hAddress: ",Btc24hAddress);


const usdt = await ethers.getContractFactory("usdt");

const Usdt = await usdt.deploy();

await Usdt.waitForDeployment()
const UsdtAddress = await Usdt.getAddress();

console.log("UsdtAddress: ",UsdtAddress);

const Liquidity = await ethers.getContractFactory("Liquidity");

const liquidity = await Liquidity.deploy();

await liquidity.waitForDeployment()
const liquidityAddress = await liquidity.getAddress();

console.log("liquidityAddress: ",liquidityAddress);





}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


