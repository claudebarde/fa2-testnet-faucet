const FA2_FT_token = artifacts.require("fa2_single_asset");
const { MichelsonMap } = require("@taquito/taquito");
const { alice } = require("../scripts/sandbox/accounts");

const totalSupply = 11111;

const initialStorage = {
  admin: {
    admin: alice.pkh,
    paused: false
  },
  assets: {
    ledger: MichelsonMap.fromLiteral({ [alice.pkh]: totalSupply }),
    operators: new MichelsonMap(),
    token_metadata: MichelsonMap.fromLiteral({
      0: {
        token_id: 0,
        symbol: "TEST",
        name: "TEST",
        decimals: 0,
        extras: new MichelsonMap()
      }
    }),
    total_supply: totalSupply
  }
};

module.exports = async (deployer, _network, accounts) => {
  deployer.deploy(FA2_FT_token, initialStorage);
};
