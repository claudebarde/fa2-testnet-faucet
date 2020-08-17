const { MichelsonMap } = require("@taquito/taquito");
const { alice, bob } = require("../../scripts/sandbox/accounts");
const setup = require("./setup");

contract("FA2 Non Fungible Token Contract - Transfers", () => {
  let storage;
  let fa2_address;
  let fa2_instance;
  let signerFactory;
  let tokenId = 0;

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
    try {
      const decimals = 0;
      const extras = new MichelsonMap();
      const name = "test";
      const symbol = "TST";
      const ownersAddress = [alice.pkh];
      const rangeFrom = 1;
      const rangeTo = 1;
      tokenId++;

      const op = await fa2_instance.methods
        .mint_tokens([
          decimals,
          extras,
          name,
          symbol,
          tokenId,
          ownersAddress,
          rangeFrom,
          rangeTo
        ])
        .send();
      console.log(op.opHash);
      await op.confirmation();
    } catch (error) {
      console.log(error);
    }
  });
});
