// see end for notes

function sleep(seconds) {
  let timeStart = new Date().getTime();
  let milliseconds = seconds * 1000;
  while (true) {
    let elapsedTime = new Date().getTime() - timeStart;
    if (elapsedTime > milliseconds) {
      break;
    }
  }
}

const main = async () => {
   
   const laughContractFactory = await hre.ethers.getContractFactory("LaughPortal");
   const laughContract = await laughContractFactory.deploy({
      value: hre.ethers.utils.parseEther('0.1'),
   });
   await laughContract.deployed();
   //compile laughContract, deploy, notify when done

   console.log("Contract address: ", laughContract.address);
   // console.log("Deployed by owner address: ", owner.address);

   let contractBalance = await hre.ethers.provider.getBalance(
      laughContract.address
    );
    console.log(
      'Contract balance before Tx:',
      hre.ethers.utils.formatEther(contractBalance)
    );

   let laughCount;
   laughCount = await laughContract.getTotalLaughs();
   console.log(laughCount.toNumber());

   const laughTxn1 = await laughContract.laugh('Laugh #1');
   await laughTxn1.wait();

   contractBalance = await hre.ethers.provider.getBalance(laughContract.address);
   console.log(
      'Contract balance after Tx 1:',
      hre.ethers.utils.formatEther(contractBalance)
   );
  
  //  sleep(20);

  //  const laughTxn2 = await laughContract.laugh('Laugh #2');
  //  await laughTxn2.wait();

  //  contractBalance = await hre.ethers.provider.getBalance(laughContract.address);
  //  console.log(
  //     'Contract balance after Tx 2:',
  //     hre.ethers.utils.formatEther(contractBalance)
  //  );

  //  sleep(20);

  //  const laughTxn3 = await laughContract.laugh('Laugh #3');
  //  await laughTxn3.wait();

  //  contractBalance = await hre.ethers.provider.getBalance(laughContract.address);
  //  console.log(
  //     'Contract balance after Tx 3:',
  //     hre.ethers.utils.formatEther(contractBalance)
  //  );


   let allLaughs = await laughContract.getAllLaughs();
   console.log(allLaughs);
   
};

const runMain = async () => {
   try {
      await main();
      process.exit(0);
   } catch (error) {
      console.log(error);
      process.exit(1);
   }
};

runMain();


//use js to have hardhat do things for us. It will do compile, deploy, and get info.
//at end of project, can deploy to ethereum or polygon. Polygon is much cheaper.