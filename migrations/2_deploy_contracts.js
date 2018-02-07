const StandardAssetRegistry = artifacts.require("./StandardAssetRegistry.sol");

module.exports = function(deployer) {
  deployer.deploy(StandardAssetRegistry);
};
