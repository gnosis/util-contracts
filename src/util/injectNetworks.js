const networkUtils = require('./networkUtils')
const DEFAULT_CONF_FILE = './conf/network-restore'

async function injectNetworks (configFilePath) {  
  console.log('Inject networks - Using conf file: %s', configFilePath)
  const conf = require(configFilePath)

  const { networksFile, buildDir } = conf

  console.log(`Inject networks from ${networksFile} into built contracts`)
  await networkUtils.updateBuiltContract(buildDir, networksFile)
  console.log('Success! All networks were injected into the built contracts')
}


module.exports = async function (configFilePath) {
  return injectNetworks(configFilePath)
}