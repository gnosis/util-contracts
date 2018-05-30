const fs = require('fs')
const path = require('path')

async function getNetworkInfo (buildPath) {  
  // Get contracts from the build path
  const contracts = await _getContracts(buildPath)

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

async function updateBuiltContract (buildPath, networkFilePath) {
  const networkInfo = require(networkFilePath)
  // Get contracts from the build path
  const contracts = await _getContracts(buildPath)

  // Update contracts
  const contractsWithNetworkInfo = contracts.reduce((acc, contract) => {
    const contractName = contract.contractName
    const networks = networkInfo[contractName]
    if (networks) {
      // There's network info for the contract, we update the contract
      const updatedContract = Object.assign(contract, {
        networks
      })
      acc.push(updatedContract)
    }
    return acc
  }, [])

  if (contractsWithNetworkInfo.length > 0) {
    // Write contract files
    contractsWithNetworkInfo.forEach(contract => {
      const filePath = path.join(buildPath, contract.contractName + '.json')
      const jsonContent = JSON.stringify(contract, null, 2) + '\n'
      fs.writeFileSync(filePath, jsonContent)
      console.log('Updated networks for: %s', filePath)
    })
  } else {
    console.log(`There isn't any network network info for the contracts in ${buildPath}`)
  }
}

function writeNetworksJson (networkInfo, networkFilePath) {
  const networkObject = toNetworkObject(networkInfo)
  const jsonContent = JSON.stringify(networkObject, null, 2) + '\n'
  fs.writeFileSync(networkFilePath, jsonContent)    
}

function toNetworkObject (networkInfo) {
  return networkInfo.reduce((acc, contract) => {
    acc[contract.name] = contract.networks
    return acc
  }, {})
}

async function _getContracts (buildPath) {
  const dirFiles = fs.readdirSync(buildPath)
  const fileNames = dirFiles.filter(fname => fname.endsWith('.json'))

  const contractsPromises = fileNames.map(fileName => {
    const fileNamePath = path.join(buildPath, fileName)
    const contract = require(fileNamePath)

    return contract
  })

  return Promise.all(contractsPromises)
}

module.exports = {
  getNetworkInfo,
  writeNetworksJson,
  updateBuiltContract,
  toNetworkObject
}