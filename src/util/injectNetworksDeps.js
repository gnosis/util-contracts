const networkUtils = require('./networkUtils')
const path = require('path')

const FILTER_OUT_MIGRATIONS = contract => contract.name !== 'Migrations'

async function injectDependencies ({
  buildPath,
  packages,
  nodeModulesPath,
  filter = FILTER_OUT_MIGRATIONS
}) {
  const buildDirPath = path.join(nodeModulesPath, buildPath)
  console.log('Getting network info from %s', buildDirPath)
  let networkInfo = await networkUtils
    .getNetworkInfo(buildDirPath)
  networkInfo = networkInfo.filter(filter)

  const contractNames = networkInfo.map(info => info.name)
  console.log('Retrieved network info for: %s', contractNames.join(', '))

  console.log('Uptate addresses for compiled contract of dependencies: %s',
    packages)

  for (let packageName of packages) {
    console.log('\nUpdate %s:', packageName)
    const buildPathPackage = path.join(
      nodeModulesPath,
      packageName,
      'node_modules',
      buildPath
    )
    // Merge network info with the dependencies
    await networkUtils.updateBuiltContractWithInfo({
      buildPath: buildPathPackage,
      networkInfo,
      override: false
    })
  }

  console.log('\nAll network info was merged into the dependencies')
}

module.exports = injectDependencies
