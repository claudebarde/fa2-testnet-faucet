<script>
  import { onMount } from "svelte";
  import { Tezos } from "@taquito/taquito";
  import config from "../config";

  let contract, storage;

  onMount(async () => {
    Tezos.setProvider({ rpc: config.rpc[config.network] });

    contract = await Tezos.wallet.at(config.contractAddress[config.network]);
    storage = await contract.storage();

    console.log(storage);
  });
</script>

<style>
  main {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .main-box {
    margin: 0 auto;
    width: 40%;
    height: 60%;
    text-align: center;
  }

  .title__elements {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }
</style>

<main>
  <div class="box main-box">
    <div class="title">
      <div class="title__elements">
        <p>FA2 Token Faucet</p>
        <p>
          <input type="checkbox" class="checkbox-wallet" />
        </p>
      </div>
      <br />
      <div class="radio-container">
        <input
          type="radio"
          name="token-type"
          id="fungible-token"
          class="select-token-type"
          checked />
        <label for="fungible-token" class="radio-label">Fungible Token</label>
        <input
          type="radio"
          name="token-type"
          id="non-fungible-token"
          class="select-token-type" />
        <label for="non-fungible-token" class="radio-label">
          Non Fungible Token
        </label>
      </div>
    </div>
  </div>
</main>
