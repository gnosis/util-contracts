const Math = artifacts.require('Math')
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

// The same WETH contract is used among many projects
//  https://blog.0xproject.com/canonical-weth-a9aa7d0279dd

module.exports = function (deployer, network, accounts) {
  const wethAddress = getWethAddress()
  if (!wethAddress) {
    console.log(`Deploying WETH contract, because the network "${network}" doesn't have any WETH address configured`)
    // deploy EtherToken (WETH)
    return deployer
      .then(() => deployer.link(Math, EtherToken))
      .then(() => deployer.deploy(EtherToken))
  } else {    
    console.log(`No need to deploy WETH contract. Using: ${wethAddress}`)
  }
}
