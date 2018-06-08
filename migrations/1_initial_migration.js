/* global artifacts */
/* eslint no-undef: "error" */

const Migrations = artifacts.require('Migrations')

module.exports = function (deployer) {
  // FIXME: Truffle was not updating the migrations
  // Strangely was fixed after manually adding the network config for
  // compiled Migration contracts.
  deployer.deploy(Migrations)
}
