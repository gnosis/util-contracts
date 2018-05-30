const networkUtils = require('./util/networkUtils')
const path = require('path')

const BUILD_DIR = path.join(__dirname, '..', 'build', 'contracts')
const NETWORKS_FILE_PATH = path.join(__dirname, '..', 'networks.json')

async function inject () {
  console.log(`Inject networks from ${NETWORKS_FILE_PATH} into built contracts`)
  await networkUtils.updateBuiltContract(BUILD_DIR, NETWORKS_FILE_PATH)
  console.log('Success! All networks were injected into the built contracts')
}

inject().catch(console.error)
