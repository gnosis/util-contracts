const fs = require('fs')
const path = require('path')

async function getNetworkInfo (dir) {
  console.log(dir)
  const dirFiles = fs.readdirSync(dir)
  const fileNames = dirFiles.filter(fname => fname.endsWith('.json'))

  const contractsPromises = fileNames.map(fileName => {
    const fileNamePath = path.join(dir, fileName)
    const contract = require(fileNamePath)

    return contract
  })

  const contracts = await Promise.all(contractsPromises)
  return contracts
    // Take just the contracts with network information
    .filter(contract => {
      const networkIds = Object.keys(contract.networks)
      return networkIds.length > 0
    })
    // Return name and networks
    .map(contract => {
      return {
        name: contract.contractName,
        networks: contract.networks,
      }
    })
}


function writeNetworksJson (networkInfo, networkFilePath) {
  const networkObject = networkInfo.reduce((acc, contract) => {
    acc[contract.name] = contract.networks
    return acc
  }, {})
  const jsonContent = JSON.stringify(networkObject, null, 2) + '\n'
  fs.writeFileSync(networkFilePath, jsonContent)    
}

module.exports = {
  getNetworkInfo,
  writeNetworksJson
}