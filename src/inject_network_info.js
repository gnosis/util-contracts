const injectNetworks = require('./util/injectNetworks')
const path = require('path')

const DEFAULT_CONF_FILE = path.join(__dirname, './conf/network-restore')

const confFile = process.env.CONF_FILE || DEFAULT_CONF_FILE
injectNetworks(confFile)
  .catch(console.error)
