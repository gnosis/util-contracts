const deployWeth = require('../src/migrations/3_deploy_WETH')

module.exports = function (deployer, network, accounts) {
  return deployWeth(artifacts, deployer, network, accounts)
}
