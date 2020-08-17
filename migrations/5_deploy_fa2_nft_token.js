const FA2_NFT_token = artifacts.require("fa2_nft_asset");
const { MichelsonMap } = require("@taquito/taquito");
const { alice } = require("../scripts/sandbox/accounts");

const initialStorage = {
  admin: {
    admin: alice.pkh,
    pending_admin: null,
    paused: false
  },
  assets: {
    ledger: new MichelsonMap(),
    operators: new MichelsonMap(),
    metadata: {
      token_defs: [],
      last_used_id: 0,
      metadata: new MichelsonMap()
    }
  }
};

module.exports = async (deployer, _network, accounts) => {
  deployer.deploy(FA2_NFT_token, initialStorage);
};

/*let store : nft_asset_storage = {
  admin = {
    admin = ("tz1YPSCGWXwBdTncK2aCctSZAXWvGsGwVJqU" : address);
    pending_admin = (None : address option);
    paused = true;
  };
  assets = {
      ledger = (Big_map.empty : (token_id, address) big_map);
      operators = (Big_map.empty : ((address * address), unit) big_map);
      metadata = {
        token_defs = (Set.empty : token_def set);
        last_used_id = 0n;
        metadata = (Big_map.empty : (token_def, token_metadata) big_map);
      };
  };
} */
