const networkUtils = require('./networkUtils')

async function injectNetworks (configFilePath) {
  console.log('Inject networks - Using conf file: %s', configFilePath)
  const conf = require(configFilePath)

  const { networkFilePath, buildPath } = conf

  console.log(`Inject networks from ${networkFilePath} into built contracts`)
  await networkUtils.updateBuiltContract({ buildPath, networkFilePath })
  console.log('Success! All networks were injected into the built contracts')
}

module.exports = async function (configFilePath) {
  return injectNetworks(configFilePath)
}
