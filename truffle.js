const HDWalletProvider = require('truffle-hdwallet-provider')

const DEFAULT_GAS_PRICE = 1e9
const GAS_LIMIT = 6700000

// Get the mnemonic
const mnemonic = process.env.MNEMONIC
const gasPrice = process.env.GAS_PRICE || DEFAULT_GAS_PRICE
const gas = GAS_LIMIT

// Allow to add an aditional network (useful for docker-compose setups)
//  i.e. NETWORK='{ "name": "docker", "networkId": "99999", "url": "http://rpc:8545", "gas": "6700000", "gasPrice": "25000000000"  }'
let aditionalNetwork = process.env.NETWORK ? JSON.parse(process.env.NETWORK) : null

console.log(`Using gas limit: ${gas}`)
console.log(`Using gas price: ${gasPrice}`)

const networks = {
  development: {
    host: 'localhost',
    port: 8545,
    gas, 
    gasPrice,
    network_id: '*'
  },
  live: {
    provider: _getProvider('https://mainnet.infura.io/'),
    network_id: '1',
    gas,
    gasPrice
  },
  kovan: {
    provider: _getProvider('https://kovan.infura.io/'),
    network_id: '42',
    gas,
    gasPrice
  },
  rinkeby: {
    provider: _getProvider('http://node.rinkeby.gnosisdev.com:8545'),
    network_id: '4',
    gas,
    gasPrice
  },
  mainnet: {
    provider: _getProvider('https://mainnet.infura.io'),
    network_id: '0',
    gas,
    gasPrice
  }
}

if (aditionalNetwork) {
  const { name, url, networkId, gas, gasPrice } = aditionalNetwork
  networks[name] = {
    provider: _getProvider(url),
    network_id: networkId,
    gas,
    gasPrice
  }
}

function _getProvider (url) {
  return () => {
    return new HDWalletProvider(mnemonic, url)
  }
}

module.exports = {
  networks,
  solc: {
    optimizer: {
      enabled: false
    }
  }
}
