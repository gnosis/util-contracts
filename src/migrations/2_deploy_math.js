async function migrate ({ artifacts, deployer }) {
  const Math = artifacts.require('Math')
  return deployer.deploy(Math)
}

module.exports = migrate
