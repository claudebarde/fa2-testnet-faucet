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

  .title {
    margin: 0 auto;
    width: 50%;
    text-align: center;
  }
</style>

<main>
  <div class="title">FA2 Token Faucet</div>
</main>
