const networkUtils = require('./util/networkUtils')
const conf = require('../conf/network-restore')

async function inject () {
  const { networksFile, buildDir } = conf

  console.log(`Inject networks from ${networksFile} into built contracts`)
  await networkUtils.updateBuiltContract(buildDir, networksFile)
  console.log('Success! All networks were injected into the built contracts')
}

inject().catch(console.error)
