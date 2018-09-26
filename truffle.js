const truffleConfig = require('./src/util/truffleConfig')

const DEFAULT_GAS_PRICE_GWEI = 5
const GAS_LIMIT = 5e6
const DEFAULT_MNEMONIC = 'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat'

// Get the mnemonic
const privateKey = process.env.PK
let mnemonic = process.env.MNEMONIC
if (!privateKey && !mnemonic) {
  mnemonic = DEFAULT_MNEMONIC
}

const gasPriceGWei = process.env.GAS_PRICE_GWEI || DEFAULT_GAS_PRICE_GWEI
const gas = GAS_LIMIT

// Allow to add an aditional network (useful for docker-compose setups)
//  i.e. NETWORK='{ "name": "docker", "networkId": "99999", "url": "http://rpc:8545", "gas": "6700000", "gasPrice": "25000000000"  }'
let aditionalNetwork = process.env.NETWORK ? JSON.parse(process.env.NETWORK) : null

module.exports = truffleConfig({
  mnemonic,
  privateKey,
  gasPriceGWei,
  gas,
  aditionalNetwork
})
