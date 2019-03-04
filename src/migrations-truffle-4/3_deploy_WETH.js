async function migrate ({ artifacts, deployer, network }) {
  const EtherToken = artifacts.require('EtherToken')

  function getWethAddress () {
    try {
      return EtherToken.address
    } catch (error) {
      // return EtherToken.address throw an error if there's no config address
      // for this network
      return null
    }
  }

  const wethAddress = getWethAddress()
  if (!wethAddress) {
    console.log(`Deploying WETH contract, because the network "${network}" doesn't have any WETH address configured`)
    // deploy EtherToken (WETH)
    return deployer.then(() => deployer.deploy(EtherToken))
  } else {
    console.log(`No need to deploy WETH contract. Using: ${wethAddress}`)
  }
}

module.exports = migrate
