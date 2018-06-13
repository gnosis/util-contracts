# util-contracts
Utility contracts for Gnosis

The token and contracts can be in **Etherscan**:

* **Mainnet**: 
  * EtherToken: https://etherscan.io/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2
  * Math: No deployed yet
* **Rinkeby**: 
  * EtherToken: https://rinkeby.etherscan.io/token/0xc778417e063141139fce010982780140aa0cd5ab
  * Math: https://rinkeby.etherscan.io/address/0x1b8211bc90f3a77c451a853cadeb8673cc1263c9
* **Kovan**:
  * EtherToken: https://kovan.etherscan.io/token/0xd0a1e359811322d97991e03f863a0c30c2cf029c
  * Math: https://kovan.etherscan.io/address/0x38a21406d226785b39033319a00a328d5c0109aa


## Setup and show the networks
```bash
# Install dependencies
yarn install

# Compile and restore the network addresses
yarn restore

# Show current network addresses
yarn networks
```

## Generate a new version
```bash
# In a release branch (i.e. release/vX.Y.X)
# Migrate the version to the testnets, at least rinkeby, and posibly mainnet
# You can optionally change the gas price using the GAS_PRICE_GWEI env variable
yarn restore
MNEMONIC="your mnemonic here..." yarn migrate --network rinkeby

# Extract the network file
yarn networks-extract

# Verify the contract in Etherscan
# Folow the steps in "Verify contract"

# Commit the network file
git add network.json
git commit -m 'Update the networks file'

# Generate version using Semantic Version: https://semver.org/
# For example, for a minor version
npm version minor
git push
git push --tags

# Deploy npm package
npm publish --access=public

# Merge tag into develop, to deploy it to production, also merge it into master
git checkout develop
git merge vX.Y.X
```

## Verify contract
Flatten the smart contract:
```bash
npx truffle-flattener contracts/<contract-name>.sol > build/<contract-name>-EtherScan.sol
```

Go to Etherscan validation page:
* Go to[https://rinkeby.etherscan.io/verifyContract?a=]()
* Fill the information:
  * Use `build/TokenGNO-<contract-name>.sol`
  * Set the exact compiler version used for the compilation i.e. `v0.4.24+commit.e67f0147`
  * Optimization: `No`
* Press validate