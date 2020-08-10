const { Tezos } = require("@taquito/taquito");
const { alice, bob } = require("../scripts/sandbox/accounts");
const setup = require("./setup");

contract("FA2 Fungible Token Contract - Transfers", () => {
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

  it("checks if Alice has an account", async () => {
    const aliceBalance = await storage.assets.ledger.get(alice.pkh);

    assert.isDefined(aliceBalance);
    assert.isAbove(aliceBalance.toNumber(), 0);
  });

  it("should prevent Alice from exceeding her balance", async () => {
    const aliceBalance = await storage.assets.ledger.get(alice.pkh);
    let err;

    try {
      const transfer = [
        {
          from_: alice.pkh,
          txs: [{ to_: bob.pkh, token_id: 0, amount: aliceBalance + 1 }]
        }
      ];
      const op = await fa2_instance.methods.transfer(transfer).send();
      await op.confirmation();
    } catch (error) {
      err = error.message;
    }

    assert.exists(err);
    assert.equal(err, "FA2_INSUFFICIENT_BALANCE");
  });

  it("should send 1000 tokens from Alice to Bob", async () => {
    const tokenAmount = 1000;
    const aliceBalance = await storage.assets.ledger.get(alice.pkh);
    let bobBalance = await storage.assets.ledger.get(bob.pkh);
    if (bobBalance) {
      bobBalance = bobBalance.toNumber();
    } else {
      bobBalance = 0;
    }

    assert.isAtLeast(aliceBalance.toNumber(), tokenAmount);

    try {
      const transfer = [
        {
          from_: alice.pkh,
          txs: [{ to_: bob.pkh, token_id: 0, amount: tokenAmount }]
        }
      ];
      const op = await fa2_instance.methods.transfer(transfer).send();
      await op.confirmation();
    } catch (error) {
      console.log("Error:", error);
    }

    storage = await fa2_instance.storage();
    const aliceNewBalance = await storage.assets.ledger.get(alice.pkh);

    assert.equal(
      aliceBalance.toNumber(),
      aliceNewBalance.toNumber() + tokenAmount
    );

    const bobNewBalance = await storage.assets.ledger.get(bob.pkh);

    assert.equal(bobNewBalance.toNumber(), bobBalance + tokenAmount);
  });

  it("should accept a batch of transactions", async () => {
    const tokenAmount = 500;

    const aliceBalance = await storage.assets.ledger.get(alice.pkh);
    const bobBalance = await storage.assets.ledger.get(bob.pkh);

    assert.isAtLeast(aliceBalance.toNumber(), tokenAmount * 2);

    try {
      const transfers = [
        {
          from_: alice.pkh,
          txs: [{ to_: bob.pkh, token_id: 0, amount: tokenAmount }]
        },
        {
          from_: alice.pkh,
          txs: [{ to_: bob.pkh, token_id: 0, amount: tokenAmount }]
        }
      ];
      const op = await fa2_instance.methods.transfer(transfers).send();
      await op.confirmation();
    } catch (error) {
      console.log("Error:", error);
    }

    storage = await fa2_instance.storage();
    const aliceNewBalance = await storage.assets.ledger.get(alice.pkh);

    assert.equal(
      aliceBalance.toNumber(),
      aliceNewBalance.toNumber() + tokenAmount * 2
    );

    const bobNewBalance = await storage.assets.ledger.get(bob.pkh);

    assert.equal(
      bobNewBalance.toNumber(),
      bobBalance.toNumber() + tokenAmount * 2
    );
  });

  it("should throw an error when last tx in batch exceeds total balance", async () => {
    const aliceBalance = await storage.assets.ledger.get(alice.pkh);
    let err;

    try {
      const transfers = [
        {
          from_: alice.pkh,
          txs: [{ to_: bob.pkh, token_id: 0, amount: 100 }]
        },
        {
          from_: alice.pkh,
          txs: [{ to_: bob.pkh, token_id: 0, amount: aliceBalance.toNumber() }]
        }
      ];
      const op = await fa2_instance.methods.transfer(transfers).send();
      await op.confirmation();
    } catch (error) {
      err = error.message;
    }

    assert.exists(err);
    assert.equal(err, "FA2_INSUFFICIENT_BALANCE");
  });

  it("should return `token undefined` with wrong token id", async () => {
    let err;

    try {
      const transfer = [
        {
          from_: alice.pkh,
          txs: [{ to_: bob.pkh, token_id: 2, amount: 100 }]
        }
      ];
      const op = await fa2_instance.methods.transfer(transfer).send();
      await op.confirmation();
    } catch (error) {
      err = error.message;
    }

    assert.exists(err);
    assert.equal(err, "FA2_TOKEN_UNDEFINED");
  });

  it("should treat transfer of 0 token as a normal transfer", async () => {
    const aliceBalance = await storage.assets.ledger.get(alice.pkh);

    try {
      const transfer = [
        {
          from_: alice.pkh,
          txs: [{ to_: bob.pkh, token_id: 0, amount: 0 }]
        }
      ];
      const op = await fa2_instance.methods.transfer(transfer).send();
      await op.confirmation();
    } catch (error) {
      console.log("Error:", error);
    }

    storage = await fa2_instance.storage();
    const aliceNewBalance = await storage.assets.ledger.get(alice.pkh);

    assert.equal(aliceBalance.toNumber(), aliceNewBalance.toNumber());
  });

  it("should treat transfer with same spender and receiver as a normal transfer", async () => {
    const aliceBalance = await storage.assets.ledger.get(alice.pkh);

    try {
      const transfer = [
        {
          from_: alice.pkh,
          txs: [{ to_: alice.pkh, token_id: 0, amount: 100 }]
        }
      ];
      const op = await fa2_instance.methods.transfer(transfer).send();
      await op.confirmation();
    } catch (error) {
      console.log("Error:", error);
    }

    storage = await fa2_instance.storage();
    const aliceNewBalance = await storage.assets.ledger.get(alice.pkh);

    assert.equal(aliceBalance.toNumber(), aliceNewBalance.toNumber());
  });

  it("should prevent Bob from transferring Alice's tokens at this point", async () => {
    await signerFactory(bob.sk);

    let err;

    try {
      const transfer = [
        {
          from_: alice.pkh,
          txs: [{ to_: bob.pkh, token_id: 0, amount: 100 }]
        }
      ];
      const op = await fa2_instance.methods.transfer(transfer).send();
      await op.confirmation();
    } catch (error) {
      err = error.message;
    }

    assert.exists(err);
    assert.equal(err, "FA2_NOT_OPERATOR");
  });
});
