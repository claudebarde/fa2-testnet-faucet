<script>
  import store from "../store";
  import config from "../config";

  const updateTokenType = async () => {
    const tokenType = $store.tokenType;
    store.updateTokenType(!tokenType);
    store.updateContractType(tokenType ? "fa2_ft" : "fa12Address");
    if ($store.tokenType) {
      document.getElementById("fungible-token").click();
    }
    // updates token instances if necessary
    if ($store.tokenType && !$store.fa12_instance) {
      // FA1.2
      const contract = await $store.Tezos.wallet.at(
        config.fa12Address[config.network]
      );
      store.updateFA12_instance(contract);
    } else if (!$store.tokenType && !$store.fa2_instance) {
      // FA2
      const contract = await $store.Tezos.wallet.at(
        config.fa2Address[config.network]
      );
      store.updateFA2_instance(contract);
    }
    // updates user's token balance if connected
    if ($store.tokenType && $store.userAddress) {
      // FA1.2
      const storage = await $store.fa12_instance.storage();

      const account = await storage.ledger.get($store.userAddress);
      if (account) {
        store.updateUserBalance(account.balance.toNumber());
      } else {
        store.updateUserBalance(0);
      }
    } else if (!$store.tokenType && $store.userAddress) {
      // FA2
      const storage = await $store.fa2_instance.storage();

      const balance = await storage.assets.ledger.get($store.userAddress);
      if (balance) {
        store.updateUserBalance(balance.toNumber());
      } else {
        store.updateUserBalance(0);
      }
    }
  };
</script>

<div class="token-type">
  <input
    type="checkbox"
    checked={$store.tokenType}
    on:click={updateTokenType} />
</div>
