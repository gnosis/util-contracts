async function migrate ({ artifacts, deployer }) {
  const SafeMath = artifacts.require('SafeMath')
  return deployer.deploy(SafeMath)
}

module.exports = migrate
