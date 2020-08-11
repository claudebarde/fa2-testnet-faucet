const FA12 = artifacts.require("FA1-2");
const { MichelsonMap } = require("@taquito/taquito");
const { alice } = require("../scripts/sandbox/accounts");

const totalSupply = 10000000000;

const initialStorage = {
  ledger: MichelsonMap.fromLiteral({
    [alice.pkh]: {
      balance: totalSupply,
      allowances: new MichelsonMap()
    }
  }),
  totalSupply
};

module.exports = async (deployer, _network, accounts) => {
  deployer.deploy(FA12, initialStorage);
};
