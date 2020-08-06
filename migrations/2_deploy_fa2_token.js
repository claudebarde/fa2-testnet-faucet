const FA2token = artifacts.require("fa2_single_asset");
const { MichelsonMap } = require("@taquito/taquito");
const { alice } = require("../scripts/sandbox/accounts");

const totalSupply = 10000;

const initialStorage = {
  admin: {
    admin: alice.pkh,
    paused: false
  },
  assets: {
    ledger: MichelsonMap.fromLiteral({ [alice.pkh]: totalSupply }),
    operators: new MichelsonMap(),
    token_metadata: new MichelsonMap(),
    total_supply: totalSupply
  }
};

module.exports = async (deployer, _network, accounts) => {
  deployer.deploy(FA2token, initialStorage);
};
