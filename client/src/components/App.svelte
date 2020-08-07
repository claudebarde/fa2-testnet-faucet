<script>
  import { onMount } from "svelte";
  import { Tezos } from "@taquito/taquito";
  import config from "../config";

  let contract, storage;

  let tokenType = false; // false for fa2, true for fa1.2
  let fa2tokenType = "fungible";

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
    text-align: center;
  }

  .title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .token-description {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }
</style>

<main>
  <div class="box main-box">
    <div class="title">
      <div class="token-type">
        <input
          type="checkbox"
          checked={tokenType}
          on:click={() => (tokenType = !tokenType)} />
      </div>
      {#if tokenType}
        <p>FA1.2 Token Faucet</p>
      {:else}
        <p>FA2 Token Faucet</p>
      {/if}
      <p class="checkbox-wallet">
        <input type="checkbox" />
      </p>
    </div>
    <br />
    <div class="radio-container">
      <input
        type="radio"
        name="token-type"
        id="fungible-token"
        class="select-token-type"
        on:click={() => (fa2tokenType = 'fungible')}
        checked />
      <label for="fungible-token" class="radio-label">Fungible Token</label>
      <input
        type="radio"
        name="token-type"
        id="non-fungible-token"
        class="select-token-type"
        disabled={tokenType}
        on:click={() => (fa2tokenType = 'nonfungible')} />
      <label for="non-fungible-token" class="radio-label">
        {#if tokenType}
          <strike>Non Fungible Token</strike>
        {:else}Non Fungible Token{/if}
      </label>
    </div>
    <br />
    <div>
      {#if fa2tokenType === 'fungible'}
        <div class="token-description">
          <p>Fungible tokens:</p>
          <p>100 tokens</p>
        </div>
      {:else if fa2tokenType === 'nonfungible'}
        <div class="token-description">
          <p>Non fungible tokens:</p>
          <p>1 token</p>
        </div>
      {/if}
      <br />
      <br />
      <button>Confirm</button>
    </div>
  </div>
</main>
