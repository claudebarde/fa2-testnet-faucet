const { Tezos } = require("@taquito/taquito");
const { alice, bob } = require("../scripts/sandbox/accounts");
const setup = require("./setup");

contract("FA2 Fungible Token Contract - View entrypoints", () => {
  let storage;
  let fa2_address;
  let fa2_instance;
  let signerFactory;

  before(async () => {
    const config = await setup();
    storage = config.storage;
    fa2_address = config.fa2_address;
    fa2_instance = config.fa2_instance;
    fa2_testContract_instance = config.fa2_testContract_instance;
    fa2_testContract_address = config.fa2_testContract_address;
    signerFactory = config.signerFactory;
  });

  it("should verify the initial balance is 0", async () => {
    storage = await fa2_testContract_instance.storage();

    assert.equal(storage, 0);
  });

  it("should return Alice's balance", async () => {
    try {
      const op = await fa2_testContract_instance.methods
        .getBalanceOf(fa2_address, [alice.pkh])
        .send();
      await op.confirmation();
    } catch (error) {
      console.log(error);
    }

    storage = await fa2_testContract_instance.storage();

    assert.isAbove(storage.toNumber(), 0);
  });

  it("should return Alice's and Bob's balances", async () => {
    const tokenAmount = 100;
    let aliceBalance = await (await fa2_instance.storage()).assets.ledger.get(
      alice.pkh
    );
    let bobBalance = await (await fa2_instance.storage()).assets.ledger.get(
      bob.pkh
    );
    if (bobBalance) {
      bobBalance = bobBalance.toNumber();
      aliceBalance = aliceBalance.toNumber();
    } else {
      bobBalance = tokenAmount;
      aliceBalance = aliceBalance.toNumber() - tokenAmount;
      // transfers 100 tokens from Alice to Bob to make sure Bob has a balance
      const transfer = [
        {
          from_: alice.pkh,
          txs: [{ to_: bob.pkh, token_id: 0, amount: tokenAmount }]
        }
      ];
      const op = await fa2_instance.methods.transfer(transfer).send();
      await op.confirmation();
    }

    // queries Alice and Bob balances
    try {
      const op = await fa2_testContract_instance.methods
        .getBalanceOf(fa2_address, [alice.pkh, bob.pkh])
        .send();
      await op.confirmation();
    } catch (error) {
      console.log(error);
    }

    // fetches new storage
    storage = await fa2_testContract_instance.storage();

    assert.equal(storage.toNumber(), aliceBalance + bobBalance);
  });
});
