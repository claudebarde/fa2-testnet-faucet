const { MichelsonMap } = require("@taquito/taquito");
const { alice, bob } = require("../../scripts/sandbox/accounts");
const setup = require("./setup");

contract("FA2 Non Fungible Token Contract - Transfers", () => {
  let storage;
  let fa2_address;
  let fa2_instance;
  let signerFactory;
  let firstTokenId = 1;

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

    try {
      const op = await fa2_instance.methods
        .mint_tokens(alice.pkh, firstTokenId, symbol, name, decimals, extras)
        .send();
      await op.confirmation();
    } catch (error) {
      console.log(error);
    }

    storage = await fa2_instance.storage();
    // checks if the token belongs to Alice
    const user = await storage.ledger.get(firstTokenId.toString());
    assert.equal(user, alice.pkh);
  });

  it("should prevent Bob from transferring Alice's token", async () => {
    await signerFactory(bob.sk);

    let err;

    try {
      const op = await fa2_instance.methods
        .transfer([
          {
            from_: alice.pkh,
            txs: [{ to_: bob.pkh, token_id: firstTokenId, amount: 1 }]
          }
        ])
        .send();
      await op.confirmation();
    } catch (error) {
      err = error.message;
    }

    assert.isDefined(err);
    assert.equal(err, "FA2_NOT_OPERATOR");
  });

  it("should transfer Alice's token to Bob", async () => {
    await signerFactory(alice.sk);
    try {
      const op = await fa2_instance.methods
        .transfer([
          {
            from_: alice.pkh,
            txs: [{ to_: bob.pkh, token_id: firstTokenId, amount: 1 }]
          }
        ])
        .send();
      await op.confirmation();
    } catch (error) {
      console.log(error);
    }

    storage = await fa2_instance.storage();
    // checks if the token belongs to Bob
    const user = await storage.ledger.get(firstTokenId.toString());
    assert.equal(user, bob.pkh);
  });

  it("should let Alice set Bob as an operator", async () => {
    let isBobOperator = !!(await storage.operators.get({
      0: alice.pkh,
      1: bob.pkh
    }));

    assert.isFalse(isBobOperator);

    try {
      const op = await fa2_instance.methods
        .update_operators([
          { add_operator: { owner: alice.pkh, operator: bob.pkh } }
        ])
        .send();
      await op.confirmation();
    } catch (error) {
      console.log(error);
    }

    storage = await fa2_instance.storage();
    isBobOperator = !!(await storage.operators.get({
      0: alice.pkh,
      1: bob.pkh
    }));

    assert.isTrue(isBobOperator);
  });

  it("should mint a token for Alice and allow Bob to transfer it", async () => {
    const decimals = 0;
    const extras = new MichelsonMap();
    const name = "test2";
    const symbol = "TST2";
    const tokenId = firstTokenId + 1;

    try {
      const op = await fa2_instance.methods
        .mint_tokens(alice.pkh, tokenId, symbol, name, decimals, extras)
        .send();
      await op.confirmation();
    } catch (error) {
      console.log(error);
    }

    storage = await fa2_instance.storage();
    let user = await storage.ledger.get(tokenId.toString());
    assert.equal(user, alice.pkh);

    await signerFactory(bob.sk);

    try {
      const op = await fa2_instance.methods
        .transfer([
          {
            from_: alice.pkh,
            txs: [{ to_: bob.pkh, token_id: tokenId, amount: 1 }]
          }
        ])
        .send();
      await op.confirmation();
    } catch (error) {
      err = error.message;
    }

    storage = await fa2_instance.storage();
    user = await storage.ledger.get(tokenId.toString());
    assert.equal(user, bob.pkh);
  });

  it("should let Alice remove Bob as an operator", async () => {
    await signerFactory(alice.sk);

    let isBobOperator = !!(await storage.operators.get({
      0: alice.pkh,
      1: bob.pkh
    }));

    assert.isTrue(isBobOperator);

    try {
      const op = await fa2_instance.methods
        .update_operators([
          { remove_operator: { owner: alice.pkh, operator: bob.pkh } }
        ])
        .send();
      await op.confirmation();
    } catch (error) {
      console.log(error);
    }

    storage = await fa2_instance.storage();
    isBobOperator = !!(await storage.operators.get({
      0: alice.pkh,
      1: bob.pkh
    }));

    assert.isFalse(isBobOperator);
  });

  it("should prevent Bob from transferring Alice's token", async () => {
    await signerFactory(bob.sk);

    let err;

    try {
      const op = await fa2_instance.methods
        .transfer([
          {
            from_: alice.pkh,
            txs: [{ to_: bob.pkh, token_id: firstTokenId, amount: 1 }]
          }
        ])
        .send();
      await op.confirmation();
    } catch (error) {
      err = error.message;
    }

    assert.isDefined(err);
    assert.equal(err, "FA2_NOT_OPERATOR");
  });

  it("should mint 2 tokens for Alice and transfer them in one transaction", async () => {
    await signerFactory(alice.sk);

    const decimals = 0;
    const extras = new MichelsonMap();
    const tokenId = firstTokenId + 2;

    try {
      const op = await fa2_instance.methods
        .mint_tokens(alice.pkh, tokenId, "TST3", "test3", decimals, extras)
        .send();
      await op.confirmation();

      const op2 = await fa2_instance.methods
        .mint_tokens(alice.pkh, tokenId + 1, "TST4", "test4", decimals, extras)
        .send();
      await op2.confirmation();
    } catch (error) {
      console.log(error);
    }
    // verifies the tokens exist
    storage = await fa2_instance.storage();
    let user = await storage.ledger.get(tokenId.toString());
    assert.equal(user, alice.pkh);
    user = await storage.ledger.get((tokenId + 1).toString());
    assert.equal(user, alice.pkh);
    // tokens transfer
    try {
      const op = await fa2_instance.methods
        .transfer([
          {
            from_: alice.pkh,
            txs: [
              { to_: bob.pkh, token_id: tokenId, amount: 1 },
              { to_: bob.pkh, token_id: tokenId + 1, amount: 1 }
            ]
          }
        ])
        .send();
      await op.confirmation();
    } catch (error) {
      console.log(error);
    }

    storage = await fa2_instance.storage();
    user = await storage.ledger.get(tokenId.toString());
    assert.equal(user, bob.pkh);
    user = await storage.ledger.get((tokenId + 1).toString());
    assert.equal(user, bob.pkh);
  });
});
