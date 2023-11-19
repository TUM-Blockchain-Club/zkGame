import { ethers } from "hardhat";

async function main() {
  const stake = "10000000000000000";
  const game = await ethers.deployContract("Game", [
    stake,
  ]);
  await game.waitForDeployment();
  console.log(
    `Game Contract with "${stake}" deployed to ${game.target}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
