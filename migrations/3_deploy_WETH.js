/* global artifacts */
/* eslint no-undef: "error" */

const deployWeth = require('../src/migrations/3_deploy_WETH')

module.exports = function (deployer, network, accounts) {
  const deployParams = { artifacts, deployer, network, accounts }
  return deployWeth(deployParams)
}
