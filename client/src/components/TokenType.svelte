<script>
  import store from "../store";
  import config from "../config";

  const updateTokenType = async type => {
    store.updateTokenType(type);
    store.updateUserBalance("--");
    if (type === "fa2_ft") {
      document.getElementById("fungible-token").click();
    }
    // updates token instances if necessary
    if (type === "fa12" && !$store.fa12_instance) {
      // FA1.2
      const contract = await $store.Tezos.wallet.at(
        config.fa12[$store.network]
      );
      store.updateFA12_instance(contract);
    } else if (type === "fa2_ft" && !$store.fa2_ft_instance) {
      // FA2
      const contract = await $store.Tezos.wallet.at(
        config.fa2Address[$store.network]
      );
      store.updateFA2_ft_instance(contract);
    }
    // updates user's token balance if connected
    if (type === "fa12" && $store.userAddress) {
      // FA1.2
      const storage = await $store.fa12_instance.storage();

      const account = await storage.ledger.get($store.userAddress);
      if (account) {
        store.updateUserBalance(account.balance.toNumber());
      } else {
        store.updateUserBalance(0);
      }
    } else if (type === "fa2_ft" && $store.userAddress) {
      // FA2
      const storage = await $store.fa2_ft_instance.storage();

      const balance = await storage.assets.ledger.get($store.userAddress);
      if (balance) {
        store.updateUserBalance(balance.toNumber());
      } else {
        store.updateUserBalance(0);
      }
    } else if (type === "tezzies" && $store.userAddress) {
      const balance = await $store.Tezos.tz.getBalance($store.userAddress);
      store.updateUserBalance(balance.toNumber() / 1000000);
    }
  };
</script>

<div class="token-choice">
  <input
    type="radio"
    name="token-choice"
    id="fa1-2"
    checked={$store.tokenType === 'fa12'}
    on:click={() => updateTokenType('fa12')} />
  <input
    type="radio"
    name="token-choice"
    id="fa2"
    checked={$store.tokenType === 'fa2_ft' || $store.tokenType === 'fa2_nft'}
    on:click={() => updateTokenType('fa2_ft')} />
  <input
    type="radio"
    name="token-choice"
    id="tezzies"
    checked={$store.tokenType === 'tezzies'}
    on:click={() => updateTokenType('tezzies')} />
  <div class="ball" />
</div>
