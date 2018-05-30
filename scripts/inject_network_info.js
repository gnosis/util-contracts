const networkUtils = require('./util/networkUtils')
const DEFAULT_CONF_FILE = '../conf/network-restore'

async function inject () {
  const confFile = process.env.CONF_FILE || DEFAULT_CONF_FILE
  console.log('Extract networks - Using conf file: %s', confFile)
  const conf = require(confFile)

  const { networksFile, buildDir } = conf

  console.log(`Inject networks from ${networksFile} into built contracts`)
  await networkUtils.updateBuiltContract(buildDir, networksFile)
  console.log('Success! All networks were injected into the built contracts')
}

inject().catch(console.error)
