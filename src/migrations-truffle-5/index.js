const deployMath = require('./2_deploy_math')
const deployWeth = require('./3_deploy_WETH')

module.exports = async params => {
  await deployMath(params)
  await deployWeth(params)
}
