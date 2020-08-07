const FA2 = artifacts.require("fa2_single_asset");
const { Tezos, MichelsonMap } = require("@taquito/taquito");
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

  /*it("checks if Alice has an account", async () => {
    const aliceBalance = await storage.assets.ledger.get(alice.pkh);

    assert.equal(
      aliceBalance.toNumber(),
      storage.assets.total_supply.toNumber()
    );
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

    const bobBalance = await storage.assets.ledger.get(bob.pkh);

    assert.equal(bobBalance.toNumber(), tokenAmount);
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
          txs: [{ to_: bob.pkh, token_id: 2, amount: 100 }]
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

  it("should set Bob as an operator for Alice", async () => {
    let err = false;
    // checks that Bob is not already set as an operator
    const pair = { 0: alice.pkh, 1: bob.pkh };

    try {
      const isBobOperator = await storage.assets.operators.get(pair);
      if(isBobOperator){
        throw new Error("Bob is already operator!")
      } else {
        const op = await fa2_instance.methods.add_operator(alice.pkh, bob.pkh).send();
      }
    } catch (error) {
      err = true
      console.log("Error:", error);
    }

    assert.isFalse(err);


  });*/

  it("should prevent Bob from setting himself as an operator for Alice", async () => {
    await signerFactory(bob.sk);

    let err;

    try {
      /*const op = await fa2_instance.methods
        .update_operators([[[], null]])
        .toTransferParams();
      console.log(op);*/
      const op = await fa2_instance.methods
        .update_operators([[alice.pkh, bob.pkh]])
        .send();
      console.log(op.opHash);
      await op.confirmation();
    } catch (error) {
      console.log("Error:", error);
      err = error.message;
    }

    //console.log(err);
  });
});
