const Math = artifacts.require('Math')
const EtherToken = artifacts.require('EtherToken')

module.exports = function (deployer) {
  deployer.deploy(Math, { overwrite: false })
  deployer.link(Math, EtherToken)
  deployer.deploy(EtherToken, { overwrite: false })
}
