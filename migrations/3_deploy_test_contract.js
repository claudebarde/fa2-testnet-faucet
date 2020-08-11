const { MichelsonMap } = require("@taquito/taquito");
const { alice } = require("../scripts/sandbox/accounts");

const FA2TestContract = artifacts.require("FA2TestContract");

module.exports = async (deployer, _network, accounts) => {
  deployer.deploy(FA2TestContract, {
    balance: 0,
    token_metadata_address: alice.pkh
  });
};
