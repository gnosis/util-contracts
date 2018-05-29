# util-contracts
Utility contracts for Gnosis

## Setup and show the networks
```bash
# Install dependencies
yarn instll

# Show current network addresses
yarn networks

# Compile and restore the network addresses
yarn restore
```

## Generate a new version
```bash
# In a release branch (i.e. release/vX.Y.X)
# Migrate the version to the testnets, at least rinkeby, and posibly mainnet
# You can optionally change the gas price using the GAS_PRICE env variable
MNEMONIC="your mnemonic here..." yarn migrate --network rinkeby

# Extract the network file
yarn networks-extract

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
