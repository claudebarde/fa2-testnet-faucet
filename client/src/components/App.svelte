<script>
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import { Tezos } from "@taquito/taquito";
  import config from "../config";
  import ConnectWallet from "./ConnectWallet.svelte";
  import UserAddress from "./UserAddress.svelte";
  import store from "../store";

  let contract, storage;

  let tokenType = false; // false for fa2, true for fa1.2
  let fa2tokenType = "fungible";
  let fungibleTokens = 50;
  let nonFungibleTokens = 5;
  let increaseTokens = undefined;
  let contractType = "fa2Address";

  const changeAmountTokens = e => {
    if (tokenType || (!tokenType && fa2tokenType === "fungible")) {
      if (e.target.value > 0 && e.target.value <= 100) {
        increaseTokens = e.target.value > fungibleTokens;
        fungibleTokens = e.target.value;
      }
    } else {
      if (e.target.value > 0 && e.target.value <= 10) {
        increaseTokens = e.target.value > nonFungibleTokens;
        nonFungibleTokens = e.target.value;
      }
    }
  };

  onMount(async () => {
    Tezos.setProvider({ rpc: config.rpc[config.network] });
    store.updateTezos(Tezos);

    contract = await Tezos.wallet.at(config[contractType][config.network]);
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

  .main-box,
  .second-box {
    margin: 0 auto;
    min-width: 600px;
    max-width: 400px;
    text-align: center;
  }

  .title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .recipient-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .recipient-container__input {
    text-align: left;
    font-size: 0.7rem;
    flex-grow: 2;
  }

  .slider-title {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .slider-container {
    width: 90%;
    padding-top: 20px;
    margin: 0 auto;
  }

  #tokenSlider::-webkit-slider-thumb::before {
    content: "+";
    width: 100%;
    color: red;
    z-index: 100;
  }
</style>

<main>
  <div class="box main-box">
    <div class="title">
      <div class="token-type">
        <input
          type="checkbox"
          checked={tokenType}
          on:click={() => {
            tokenType = !tokenType;
            if (tokenType) {
              document.getElementById('fungible-token').click();
            }
          }} />
      </div>
      <div>
        {#if tokenType}
          <p
            in:fly={{ y: 30, duration: 200, delay: 200 }}
            out:fly={{ y: -30, duration: 200 }}>
            FA1.2 Token Faucet
          </p>
        {:else}
          <p
            out:fly={{ y: -30, duration: 200 }}
            in:fly={{ y: 30, duration: 200, delay: 200 }}>
            FA2 Token Faucet
          </p>
        {/if}
      </div>
      <div>
        <ConnectWallet />
      </div>
    </div>
    <br />
    <UserAddress />
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
      <div class="slider-title">
        <div>Tokens</div>
        {#if !tokenType}
          {#if fa2tokenType === 'fungible'}
            <div>{fungibleTokens}</div>
          {:else}
            <div>{nonFungibleTokens}</div>
          {/if}
        {:else}
          <div>{fungibleTokens}</div>
        {/if}
      </div>
      <div class="slider-container">
        {#if !tokenType}
          <!-- FA2 token -->
          {#if fa2tokenType === 'fungible'}
            <input
              type="range"
              min="1"
              max="100"
              value={fungibleTokens}
              on:input={changeAmountTokens}
              on:change={changeAmountTokens}
              id="tokenSlider" />
          {:else}
            <input
              type="range"
              min="1"
              max="10"
              value={nonFungibleTokens}
              on:input={changeAmountTokens}
              on:change={changeAmountTokens}
              id="tokenSlider" />
          {/if}
        {:else}
          <!-- FA1.2 token -->
          <input
            type="range"
            min="1"
            max="100"
            value={fungibleTokens}
            on:input={changeAmountTokens}
            on:change={changeAmountTokens}
            id="tokenSlider" />
        {/if}
      </div>
    </div>
    <br />
    <div style="width:100%">
      <div class="recipient-container">
        <div class="recipient-container__input">
          <input type="text" placeholder="Recipient's address" />
        </div>
        <button>
          <i class="icon far fa-thumbs-up" />
        </button>
      </div>
    </div>
  </div>
  <br />
  <div class="small-box second-box">
    <a
      href="https://www.github.com"
      class="github"
      target="_blank"
      rel="noopener noreferrer">
      <i class="fab fa-github" />
    </a>
    <a
      href="https://www.github.com"
      class="contract"
      target="_blank"
      rel="noopener noreferrer">
      <i class="far fa-file-code" />
    </a>
    <a
      href="https://www.twitter.com"
      class="twitter"
      target="_blank"
      rel="noopener noreferrer">
      <i class="fab fa-twitter" />
    </a>
    <a
      href="https://www.telegram.org"
      class="telegram"
      target="_blank"
      rel="noopener noreferrer">
      <i class="fab fa-telegram-plane" />
    </a>
  </div>
</main>
