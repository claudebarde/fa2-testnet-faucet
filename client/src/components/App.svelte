<script>
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import { Tezos } from "@taquito/taquito";
  import config from "../config";

  let contract, storage;
  let userAddress = "tz1SjrNeUE4zyPGSZpogDZd5tvryixNDsD2v";
  let userBalance;

  let tokenType = false; // false for fa2, true for fa1.2
  let fa2tokenType = "fungible";
  let fungibleTokens = 50;
  let nonFungibleTokens = 5;

  const changeAmountTokens = e => {
    if (tokenType || (!tokenType && fa2tokenType === "fungible")) {
      if (e.target.value > 0 && e.target.value <= 100) {
        fungibleTokens = e.target.value;
      }
    } else {
      if (e.target.value > 0 && e.target.value <= 10) {
        nonFungibleTokens = e.target.value;
      }
    }
  };

  onMount(async () => {
    Tezos.setProvider({ rpc: config.rpc[config.network] });

    contract = await Tezos.wallet.at(config.contractAddress[config.network]);
    storage = await contract.storage();

    console.log(storage);

    userBalance = await Tezos.tz.getBalance(userAddress);
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

  .address-container__text {
    text-align: left;
    font-size: 0.8rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 5px 20px;
  }

  .subtitle {
    opacity: 0.7;
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
      <p class="checkbox-wallet">
        <input type="checkbox" />
      </p>
    </div>
    <br />
    <div class="address-container">
      <div class="img-container">
        <img
          src={`https://services.tzkt.io/v1/avatars/${userAddress}`}
          alt="avatar" />
      </div>
      <div style="width:100%">
        <div class="address-container__text">
          <div>
            <p>Status: Connected</p>
            <p class="subtitle">
              Address: {userAddress.slice(0, 7) + '...' + userAddress.slice(-7)}
            </p>
          </div>
          <div>
            <p>Balance</p>
            {#if userBalance}
              <p class="subtitle">ꜩ {userBalance.toNumber()}</p>
            {:else}
              <p class="subtitle">---</p>
            {/if}
          </div>
        </div>
      </div>
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
              on:change={changeAmountTokens} />
          {:else}
            <input
              type="range"
              min="1"
              max="10"
              value={nonFungibleTokens}
              on:input={changeAmountTokens}
              on:change={changeAmountTokens} />
          {/if}
        {:else}
          <!-- FA1.2 token -->
          <input
            type="range"
            min="1"
            max="100"
            value={fungibleTokens}
            on:input={changeAmountTokens}
            on:change={changeAmountTokens} />
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
  <div class="small-box">
    <a href="https://www.github.com" class="github">
      <i class="fab fa-github" />
    </a>
    <a href="https://www.github.com" class="contract">
      <i class="far fa-file-code" />
    </a>
    <a href="https://www.twitter.com" class="twitter">
      <i class="fab fa-twitter" />
    </a>
    <a href="https://www.telegram.com" class="telegram">
      <i class="fab fa-telegram-plane" />
    </a>
  </div>
</main>
