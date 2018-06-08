const networkUtils = require('./networkUtils')

// Do not extract the networks for the Migrations contract
const DEFAULT_FILTER_DEPENDENCIES = ({ name }) => (name === 'Migrations')

async function extractNetworks (configFilePath) {
  console.log('Extract networks - Using conf file: %s', configFilePath)
  const conf = require(configFilePath)

  // Get the network info
  const networkInfo = await _getNetworkInfo(conf)
  let networkFilePath = conf.networkFilePath
  if (networkInfo.length > 0) {
    // Write the network.json file
    const contractNames = networkInfo.map(contract => contract.name)
    console.log(`Write networks with the addresses for: ${contractNames.join(', ')}`)
    networkUtils.writeNetworksJson(networkInfo, networkFilePath)
    console.log(`Success! The addresses were extracted into ${networkFilePath}`)
  } else {
    // Write an empty network.json file
    networkUtils.writeNetworksJson(networkInfo, networkFilePath)
    console.log(`There isn't any network information in the compiled contracts`)
  }
}

async function _getNetworkInfo (conf) {
  // Main network info
  const networkInfoProject = await networkUtils.getNetworkInfo(conf.buildPath)

  // Dependencies network info
  let networkInfoDependencies = await _getNetworkInfoForDependencies(conf)

  // Filter: Useful, for example to remove the Migrations addresses
  const filterDependencies = conf.extractNetworkFilter || DEFAULT_FILTER_DEPENDENCIES
  networkInfoDependencies = networkInfoDependencies.filter(filterDependencies)

  return Object.assign(networkInfoDependencies, networkInfoProject)
}

async function _getNetworkInfoForDependencies (conf) {
  // Extract the network info from all of the build paths
  const networkInfosPromises = conf.buildDirDependencies.map(async buildPath => {
    const networkInfo = await networkUtils.getNetworkInfo(buildPath)
    return networkUtils.toNetworkObject(networkInfo)
  })
  const networkInfos = await Promise.all(networkInfosPromises)

  // We merge all the network info
  const networkInfoObject = networkInfos.reduce((acc, networkInfo) => {
    Object.assign(acc, networkInfo)
    return acc
  }, {})

  return Object.keys(networkInfoObject).map(name => ({
    name,
    networks: networkInfoObject[name]
  }))
}

module.exports = async function (configFilePath) {
  return extractNetworks(configFilePath)
}
