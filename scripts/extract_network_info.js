const networkUtils = require('./util/networkUtils')
const conf = require('../conf/network-restore')

async function extract () {
  // Get the network info
  const networkInfo = await _getNetworkInfo(conf)
  const networksFile = conf.networksFile
  if (networkInfo.length > 0) {
    // Write the network.json file
    const contractNames = networkInfo.map(contract => contract.name)
    console.log(`Write networks with the addresses for: ${contractNames.join(', ')}`)  
    networkUtils.writeNetworksJson(networkInfo, networksFile)
    console.log(`Success! The addresses were extracted into ${networksFile}`)
  } else {
    // Write an empty network.json file
    networkUtils.writeNetworksJson(networkInfo, networksFile)
    console.log(`There isn't any network information in the compiled contracts`)
  }
}

async function _getNetworkInfo (conf) {
  // Extract the network info from all of the build paths
  const buildDirs = [ conf.buildDir, ...conf.buildDirDependencies ]
  const networkInfosPromises = buildDirs.map(async buildDir => {
    const networkInfo = await networkUtils.getNetworkInfo(buildDir)
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

extract().catch(console.error)
