/* global artifacts */
/* eslint no-undef: "error" */

const Migrations = artifacts.require('Migrations')

module.exports = function (deployer) {
  deployer.deploy(Migrations)
}
