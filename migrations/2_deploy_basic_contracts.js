const Math = artifacts.require('Math')
const EtherToken = artifacts.require('EtherToken')

module.exports = function (deployer) {
  // deploy Math
  return deployer.deploy(Math, { overwrite: false })
    // Deploy EtherToken
    .then(() => deployer.link(Math, EtherToken))
    .then(() => deployer.deploy(EtherToken, { overwrite: false }))
}
