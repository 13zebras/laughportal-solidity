const main = async () => {
  const laughContractFactory = await hre.ethers.getContractFactory("LaughPortal");
  const laughContract = await laughContractFactory.deploy({
    value: hre.ethers.utils.parseEther('0.03'),
  });

  await laughContract.deployed();

  console.log("LaughPortal address: ", laughContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
