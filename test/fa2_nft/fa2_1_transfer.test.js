const { MichelsonMap } = require("@taquito/taquito");
const { alice, bob } = require("../../scripts/sandbox/accounts");
const setup = require("./setup");

contract("FA2 Non Fungible Token Contract - Transfers", () => {
  let storage;
  let fa2_address;
  let fa2_instance;
  let signerFactory;

  before(async () => {
    const config = await setup();
    storage = config.storage;
    fa2_address = config.fa2_address;
    fa2_instance = config.fa2_instance;
    signerFactory = config.signerFactory;
  });

  it("checks if Alice is the admin", async () => {
    const admin = await storage.admin.admin;

    assert.equal(admin, alice.pkh);
  });

  it("should mint 1 token for Alice", async () => {
    const decimals = 0;
    const extras = new MichelsonMap();
    const name = "test";
    const symbol = "TST";
    const tokenId = Date.now();
    const owners = [alice.pkh];
    const rangeFrom = 0;
    const rangeTo = 1;

    try {
      const op = await fa2_instance.methods
        .mint_tokens(
          decimals,
          extras,
          name,
          symbol,
          tokenId,
          owners,
          rangeFrom,
          rangeTo
        )
        .send();
      await op.confirmation();
    } catch (error) {
      console.log(error);
    }

    storage = await fa2_instance.storage();
    const aliceAddress = await storage.assets.ledger.get("0");

    assert.equal(aliceAddress, alice.pkh);

    const mintedToken = await storage.assets.metadata.metadata.get({
      0: rangeFrom,
      1: rangeTo
    });

    assert.equal(tokenId, mintedToken.token_id.toNumber());
    assert.equal(name, mintedToken.name);
  });

  it("should mint 3 tokens for Bob", async () => {
    const decimals = 0;
    const extras = new MichelsonMap();
    const name = "bobCoin";
    const symbol = "BBC";
    const tokenId = Date.now();
    const owners = [bob.pkh, bob.pkh, bob.pkh];
    const rangeFrom = storage.assets.metadata.last_used_id.toNumber();
    const rangeTo = storage.assets.metadata.last_used_id.toNumber() + 3;

    try {
      const op = await fa2_instance.methods
        .mint_tokens(
          decimals,
          extras,
          name,
          symbol,
          tokenId,
          owners,
          rangeFrom,
          rangeTo
        )
        .send();
      await op.confirmation();
    } catch (error) {
      console.log(error);
    }

    storage = await fa2_instance.storage();
    const bobAddress = await storage.assets.ledger.get("1");

    assert.equal(bobAddress, bob.pkh);

    const mintedToken = await storage.assets.metadata.metadata.get({
      0: rangeFrom,
      1: rangeTo
    });

    assert.equal(tokenId, mintedToken.token_id.toNumber());
    assert.equal(name, mintedToken.name);
  });
});
