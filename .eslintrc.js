module.exports = {
  extends: 'standard',
  plugins: [],
  rules: {
    strict: 0,
    'arrow-parens': [2, 'as-needed'],
    'no-undef': "error",
  },
  env: {
    es6: true,
    node: true,
    mocha: true,
  },
  globals: {
    artifacts: false,
    contract: false,
    assert: false,
    web3: false,
  },
}
