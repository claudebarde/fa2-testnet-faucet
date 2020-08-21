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

  it("checks if contract is deployed", async () => {
    assert.isDefined(fa2_address);
    assert.isDefined(fa2_instance);
  });

  it("should mint 1 token for Alice", async () => {
    const decimals = 0;
    const extras = new MichelsonMap();
    const name = "test";
    const symbol = "TST";
    const tokenId = 1;

    try {
      const op = await fa2_instance.methods
        .mint_tokens(alice.pkh, tokenId, symbol, name, decimals, extras)
        .send();
      await op.confirmation();
    } catch (error) {
      console.log(error);
    }

    storage = await fa2_instance.storage();
    // checks if the token belongs to Alice
    const user = await storage.ledger.get(tokenId.toString());
    assert.equal(user, alice.pkh);
  });
});
