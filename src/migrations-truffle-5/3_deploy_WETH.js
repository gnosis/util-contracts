async function migrate ({ artifacts, deployer, network }) {
  const EtherToken = artifacts.require('EtherToken')

  const wethAddress = _getWethAddress(EtherToken)
  if (!wethAddress) {
    console.log(`Deploying WETH contract, because the network "${network}" doesn't have any WETH address configured`)
    // deploy EtherToken (WETH)

    console.log('Deploy EtherToken')
    await deployer.deploy(EtherToken)
  } else {
    console.log(`No need to deploy WETH contract. Using: ${wethAddress}`)
  }
}

function _getWethAddress (EtherToken) {
  try {
    return EtherToken.address
  } catch (error) {
    // return EtherToken.address throw an error if there's no config address
    // for this network
    return null
  }
}

module.exports = migrate
