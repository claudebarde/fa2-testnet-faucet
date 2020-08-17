const { Tezos, BigMapAbstraction } = require("@taquito/taquito");
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
});
