const Math = artifacts.require('Math')
const EtherToken = artifacts.require('EtherToken')

async function deploy (deployer) {
  // deploy Math
  await (deployer.deploy(Math, { overwrite: false }))

  // Deploy EtherToken
  await deployer.link(Math, EtherToken)
  await deployer.deploy(EtherToken, { overwrite: false })
}

module.exports = function (deployer) {
  return deploy(deployer)
}
