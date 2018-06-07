function migrate (artifacts, deployer, network, accounts) {
  const Math = artifacts.require('Math')

  return deployer.deploy(Math)
}

module.exports = migrate
