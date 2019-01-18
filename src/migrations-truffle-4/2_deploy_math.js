async function migrate ({ artifacts, deployer }) {
  const Math = artifacts.require('GnosisMath')
  return deployer.deploy(Math)
}

module.exports = migrate
