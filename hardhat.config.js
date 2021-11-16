require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: process.env.STAGING_ALCHEMY_API,
      accounts: [process.env.PRIVATE_KEY_RINKEBY],
    },
    mainnet: {
      chainId: 1,
      url: process.env.PROD_ALCHEMY_API,
      accounts: [process.env.PRIVATE_KEY_PROD],
    },
  },
  
};
