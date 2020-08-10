const FA2TestContract = artifacts.require("FA2TestContract");

module.exports = async (deployer, _network, accounts) => {
  deployer.deploy(FA2TestContract, 0);
};
