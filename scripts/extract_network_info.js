const networkUtils = require('./util/networkUtils')
const path = require('path')

const BUILD_DIR = path.join(__dirname, '..', 'build', 'contracts')
const NETWORKS_FILE_PATH = path.join(__dirname, '..', 'networks.json')

async function extract () {
  const networkInfo = await networkUtils.getNetworkInfo(BUILD_DIR)
  if (networkInfo.length > 0) {
    const contractNames = networkInfo.map(contract => contract.name)
    console.log(`Write networks with the addresses for: ${contractNames.join(', ')}`)  
    networkUtils.writeNetworksJson(networkInfo, NETWORKS_FILE_PATH)
    console.log(`Success! The addresses were extracted into ${NETWORKS_FILE_PATH}`)
  } else {
    networkUtils.writeNetworksJson(networkInfo, NETWORKS_FILE_PATH)
    console.log(`There isn't any network information in the compiled contracts`)
  }
}

extract().catch(console.error)
