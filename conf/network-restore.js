const path = require('path')

const BUILD_DIR = path.join(__dirname, '..', 'build', 'contracts')
const NETWORKS_FILE_PATH = path.join(__dirname, '..', 'networks.json')

module.exports = {
  buildDir: BUILD_DIR,
  buildDirDependencies: [],
  networksFile: NETWORKS_FILE_PATH
}