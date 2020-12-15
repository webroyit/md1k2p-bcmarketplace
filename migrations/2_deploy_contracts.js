const Marketplace = artifacts.require("Marketplace");

// It will take this contract and place it on the blockchain
module.exports = function(deployer) {
  deployer.deploy(Marketplace);
};
