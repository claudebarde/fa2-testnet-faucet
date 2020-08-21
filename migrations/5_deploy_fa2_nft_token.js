const FA2_NFT_token = artifacts.require("fa2_nft_asset");
const { MichelsonMap } = require("@taquito/taquito");
const { alice } = require("../scripts/sandbox/accounts");

const initialStorage = {
  ledger: new MichelsonMap(),
  operators: new MichelsonMap(),
  token_metadata: new MichelsonMap()
};

module.exports = async (deployer, _network, accounts) => {
  deployer.deploy(FA2_NFT_token, initialStorage);
};
