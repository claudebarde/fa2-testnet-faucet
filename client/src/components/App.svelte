<script>
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import { TezosToolkit } from "@taquito/taquito";
  import config from "../config";
  import ConnectWallet from "./ConnectWallet.svelte";
  import UserAddress from "./UserAddress.svelte";
  import TransferTokens from "./TransferTokens.svelte";
  import TokenType from "./TokenType.svelte";
  import store from "../store";

  let contract, storage, Tezos;

  let fungibleTokens = 50;
  let nonFungibleTokens = 1;
  let increaseTokens = undefined;
  let recipientAddress = "";

  const changeAmountTokens = e => {
    if (
      $store.tokenType === "fa12" ||
      $store.tokenType === "fa2_ft" ||
      $store.tokenType === "tezzies"
    ) {
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
    Tezos = new TezosToolkit(config.rpc[config.network]);
    //Tezos.setProvider({ rpc: config.rpc[config.network] });
    store.updateTezos(Tezos);
    console.log(process.env.NODE_ENV);
    if ($store.tokenType === "fa12") {
      // creates instance for FA1.2 contract
      const contract = await Tezos.wallet.at(config.fa12[config.network]);
      store.updateFA12_instance(contract);
    } else {
      // creates instance for FA2 contract
      const contract = await Tezos.wallet.at(config.fa2_ft[config.network]);
      store.updateFA2_ft_instance(contract);
    }
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
      <TokenType />
      <div>
        {#if $store.tokenType === 'fa12'}
          <p
            in:fly={{ y: 30, duration: 200, delay: 200 }}
            out:fly={{ y: -30, duration: 200 }}>
            FA1.2 Token Faucet
          </p>
        {:else if $store.tokenType === 'fa2_ft' || $store.tokenType === 'fa2_nft'}
          <p
            out:fly={{ y: -30, duration: 200 }}
            in:fly={{ y: 30, duration: 200, delay: 200 }}>
            FA2 Token Faucet
          </p>
        {:else}
          <p
            out:fly={{ y: -30, duration: 200 }}
            in:fly={{ y: 30, duration: 200, delay: 200 }}>
            XTZ Faucet
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
        on:click={async () => {
          store.updateUserBalance('--');
          if ($store.tokenType === 'fa12') {
            store.updateTokenType('fa12');
          } else {
            store.updateTokenType('fa2_ft');
            const storage = await $store.fa2_ft_instance.storage();
            const balance = await storage.assets.ledger.get($store.userAddress);
            if (balance) {
              store.updateUserBalance(balance.toNumber());
            } else {
              store.updateUserBalance(0);
            }
          }
        }}
        checked />
      <label for="fungible-token" class="radio-label">Fungible Token</label>
      <input
        type="radio"
        name="token-type"
        id="non-fungible-token"
        class="select-token-type"
        disabled={$store.tokenType === 'fa12'}
        on:click={async () => {
          store.updateUserBalance('--');
          store.updateTokenType('fa2_nft');
          const ledgerJson = await fetch(`https://api.better-call.dev/v1//bigmap/carthagenet/${config.ledgerID}/keys`);
          const ledger = await ledgerJson.json();
          if (ledger) {
            const balance = ledger.filter(token => token.data.value.value === $store.userAddress).length;
            store.updateUserBalance(balance);
          } else {
            store.updateUserBalance('Not available');
          }
          if (!$store.fa2_nft_instance) {
            const contract = await Tezos.wallet.at(config.fa2_nft[config.network]);
            store.updateFA2_nft_instance(contract);
          }
        }} />
      <label for="non-fungible-token" class="radio-label">
        {#if $store.tokenType === 'fa12' || $store.tokenType === 'tezzies'}
          <strike>Non Fungible Token</strike>
        {:else}Non Fungible Token{/if}
      </label>
    </div>
    <br />
    <div>
      <div class="slider-title">
        <div>Tokens</div>
        {#if $store.tokenType === 'fa2_ft' || $store.tokenType === 'fa12' || $store.tokenType === 'tezzies'}
          <div>{fungibleTokens}</div>
        {:else}
          <div><span>{nonFungibleTokens}</span></div>
        {/if}
      </div>
      <div class="slider-container">
        {#if $store.tokenType === 'fa2_ft' || $store.tokenType === 'fa12' || $store.tokenType === 'tezzies'}
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
      </div>
    </div>
    <br />
    <div style="width:100%">
      <TransferTokens {fungibleTokens} {nonFungibleTokens} />
    </div>
  </div>
  <br />
  <div class="small-box second-box">
    <a
      href="https://github.com/claudebarde/fa2-testnet-faucet"
      class="github"
      target="_blank"
      rel="noopener noreferrer">
      <i class="fab fa-github" />
    </a>
    <a
      href={`https://better-call.dev/carthagenet/${$store.tokenType === 'fa12' ? config.fa12.carthagenet : $store.tokenType === 'fa2_ft' ? config.fa2_ft.carthagenet : config.fa2_nft.carthagenet}/operations`}
      class="contract"
      target="_blank"
      rel="noopener noreferrer">
      <i class="far fa-file-code" />
    </a>
    <a
      href="https://twitter.com/TezosTaquito"
      class="twitter"
      target="_blank"
      rel="noopener noreferrer">
      <i class="fab fa-twitter" />
    </a>
    <a
      href="https://t.me/tezostaquito"
      class="telegram"
      target="_blank"
      rel="noopener noreferrer">
      <i class="fab fa-telegram-plane" />
    </a>
    <a
      href="https://better-call.dev/"
      class="bcd"
      target="_blank"
      rel="noopener noreferrer">
      <span>BCD</span>
    </a>
  </div>
</main>
