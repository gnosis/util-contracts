const Math = artifacts.require('Math')
const EtherToken = artifacts.require('EtherToken')

// The same WETH contract is used among many projects
//  https://blog.0xproject.com/canonical-weth-a9aa7d0279dd
const WETH_ADDRESSES = {
  'live': '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  'mainnet': '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  'rinkeby': '0xc778417e063141139fce010982780140aa0cd5ab',
  'kovan': '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
  'ropsten': '0xc778417e063141139fce010982780140aa0cd5ab'
}

module.exports = function (deployer, network, accounts) {
  const wethAddress = WETH_ADDRESSES[network]
  if (!wethAddress) {
    console.log(`Deploying WETH contract, because the network "${network}" doesn't have any WETH address configured`)
    // deploy EtherToken (WETH)
    return deployer.link(Math, EtherToken)
      .then(() => deployer.deploy(EtherToken, { overwrite: false }))
  } else {    
    console.log(`No need to deploy WETH contract. Using: ${wethAddress}`)
  }
}
