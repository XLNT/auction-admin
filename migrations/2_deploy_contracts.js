const HillCore = artifacts.require("./HillCore.sol");

module.exports = function(deployer) {
  deployer.deploy(HillCore);
};
