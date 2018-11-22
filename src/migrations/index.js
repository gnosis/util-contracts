const deployMath = require('./2_deploy_math')
const deployWeth = require('./3_deploy_WETH')

module.exports = params => {
  return params.deployer
    .then(() => deployMath(params))
    .then(() => deployWeth(params))
}
