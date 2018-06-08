/* global artifacts */
/* eslint no-undef: "error" */

const deployMath = require('../src/migrations/2_deploy_math.js')

module.exports = function (deployer, network, accounts) {
  const deployParams = { artifacts, deployer, network, accounts }
  return deployMath(deployParams)
}
