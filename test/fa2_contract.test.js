const FA2 = artifacts.require("fa2_single_asset");
const { Tezos } = require("@taquito/taquito");
const { InMemorySigner } = require("@taquito/signer");
const { alice, bob } = require("../scripts/sandbox/accounts");

const signerFactory = async pk => {
  await Tezos.setProvider({ signer: new InMemorySigner(pk) });
  return Tezos;
};

contract("FA2 Fungible Token Contract", () => {
  let storage;
  let fa2_address;
  let fa2_instance;

  before(async () => {
    fa2_instance = await FA2.deployed();
    // this code bypasses Truffle config to be able to have different signers
    // until I find how to do it directly with Truffle
    await Tezos.setProvider({ rpc: "http://localhost:8732" });
    await signerFactory(alice.sk);
    /**
     * Display the current contract address for debugging purposes
     */
    console.log("Contract deployed at:", fa2_instance.address);
    fa2_address = fa2_instance.address;
    fa2_instance = await Tezos.contract.at(fa2_instance.address);
    storage = await fa2_instance.storage();
  });

  it("checks if Alice has an account", async () => {
    const aliceBalance = await storage.assets.ledger.get(alice.pkh);

    assert.equal(
      aliceBalance.toNumber(),
      storage.assets.total_supply.toNumber()
    );
  });
});
