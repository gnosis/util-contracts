const deployMath = require('../src/migrations/2_deploy_math.js')

module.exports = function (deployer, network, accounts) {
  return deployMath(artifacts, deployer, network, accounts)
}
