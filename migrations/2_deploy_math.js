const Math = artifacts.require('Math')

module.exports = function (deployer, network, accounts) {
  // deploy Math
  return deployer.deploy(Math, { overwrite: false })
}
