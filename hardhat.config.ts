import "@nomiclabs/hardhat-waffle";

import dotenv from "dotenv";

dotenv.config();
const { SOLC_VERSION } = process.env;

export default {
  paths: {
    artifacts: "build/artifacts",
    cache: "build/cache",
  },
  solidity: SOLC_VERSION ?? "0.8.3",
};
