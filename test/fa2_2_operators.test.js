const { Tezos } = require("@taquito/taquito");
const { InMemorySigner } = require("@taquito/signer");
const { alice, bob } = require("../scripts/sandbox/accounts");
const setup = require("./setup");

contract("FA2 Fungible Token Contract - Operators", () => {
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

  it("should prevent Bob from setting himself as an operator for Alice", async () => {
    await signerFactory(bob.sk);
    let err;

    try {
      const op = await fa2_instance.methods
        .update_operators([
          { add_operator: { owner: alice.pkh, operator: bob.pkh } }
        ])
        .send();
      await op.confirmation();
    } catch (error) {
      err = error.message;
    }

    assert.exists(err);
    assert.equal(err, "FA2_NOT_OWNER");
  });

  it("should set Bob as an operator for Alice", async () => {
    await signerFactory(alice.sk);

    let err = false;
    // checks that Bob is not already set as an operator
    const pair = { 0: alice.pkh, 1: bob.pkh };

    try {
      const isBobOperator = await storage.assets.operators.get(pair);
      if (isBobOperator) {
        throw new Error("ALREADY_OPERATOR");
      } else {
        const op = await fa2_instance.methods
          .update_operators([
            { add_operator: { owner: alice.pkh, operator: bob.pkh } }
          ])
          .send();
        await op.confirmation();
      }
    } catch (error) {
      err = true;
      console.log("Error:", error);
    }

    assert.isFalse(err);

    const aliceBobPair = await storage.assets.operators.get(pair);
    // this weirdly returns a Symbol()

    assert.isDefined(aliceBobPair);
  });

  it("should let Bob spend some of Alice's tokens", async () => {
    await signerFactory(bob.sk);

    const tokens = 100;
    let bobBalance = await storage.assets.ledger.get(bob.pkh);
    if (bobBalance) {
      bobBalance = bobBalance.toNumber();
    } else {
      bobBalance = 0;
    }

    try {
      const transfer = [
        {
          from_: alice.pkh,
          txs: [{ to_: bob.pkh, token_id: 0, amount: tokens }]
        }
      ];
      const op = await fa2_instance.methods.transfer(transfer).send();
      await op.confirmation();
    } catch (error) {
      console.log(error);
    }

    const bobNewBalance = await storage.assets.ledger.get(bob.pkh);

    assert.equal(bobNewBalance, bobBalance + tokens);
  });

  it("should be possible to update operators for a user with no balance", async () => {
    const userSk = "edsk3Sb16jcx9KrgMDsbZDmKnuN11v4AbTtPBgBSBTqYftd8Cq3i1e";
    const userPkh = "tz1MnmtP4uAcgMpeZN6JtyziXeFqqwQG6yn6";
    await signerFactory(userSk);

    try {
      const op = await fa2_instance.methods
        .update_operators([
          { add_operator: { owner: userPkh, operator: alice.pkh } }
        ])
        .send();
      await op.confirmation();
    } catch (error) {
      console.log(error);
    }

    const pair = { 0: userPkh, 1: alice.pkh };
    const eveAlicePair = await storage.assets.operators.get(pair);

    assert.isDefined(eveAlicePair);
  });
});
