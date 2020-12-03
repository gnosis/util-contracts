const fs = require('fs')
const path = require('path')

async function getNetworkInfo (buildPath) {
  // Get contracts from the build path
  const contracts = await _getContracts(buildPath)

  return contracts
    // Take just the contracts with network information
    .filter(contract => {
      if (!contract.networks) return false
      const networkIds = Object.keys(contract.networks)
      return networkIds.length > 0
    })
    // Return name and networks
    .map(contract => {
      return {
        name: contract.contractName,
        networks: contract.networks
      }
    })
}

async function updateBuiltContract ({
  buildPath,
  networkFilePath,
  override
}) {
  const networkObj = require(networkFilePath)
  return _updateBuiltContract({ buildPath, networkObj })
}

async function updateBuiltContractWithInfo ({
  buildPath,
  networkInfo,
  override
}) {
  const networkObj = toNetworkObject(networkInfo)
  return _updateBuiltContract({ buildPath, networkObj, override })
}

function writeNetworksJson (networkInfo, networkFilePath) {
  const networkObject = toNetworkObject(networkInfo)
  const jsonContent = JSON.stringify(networkObject, null, 2) + '\n'
  fs.writeFileSync(networkFilePath, jsonContent)
}

function toNetworkObject (networkInfo) {
  return networkInfo.reduce((acc, contract) => {
    // Pruning unnecessary event data from network info
    for (const networkId of Object.keys(contract.networks)) {
      delete contract.networks[networkId]['events']
    }
    acc[contract.name] = contract.networks
    return acc
  }, {})
}

async function _updateBuiltContract ({
  buildPath,
  networkObj,
  override = true,
  contractFilter
}) {
  // Get contracts from the build path
  const contracts = await _getContracts(buildPath)

  // Filter contracts
  let filteredContracts
  if (contractFilter) {
    filteredContracts = contracts.filter(contractFilter)
  } else {
    filteredContracts = contracts
  }

  // Update contracts
  const contractsWithNetworkInfo = filteredContracts.reduce((acc, contract) => {
    const contractName = contract.contractName
    const networks = networkObj[contractName]
    if (networks) {
      // There's network info for the contract, we update the contract
      let mergedNetworks
      if (override) {
        // No merge. Just override
        mergedNetworks = networks
      } else {
        mergedNetworks = Object.assign(contract.networks, networks)
      }
      const updatedContract = Object.assign(contract, {
        networks: mergedNetworks
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
  updateBuiltContractWithInfo,
  toNetworkObject
}
