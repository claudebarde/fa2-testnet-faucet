<script>
  import store from "../store";
  import { TezBridgeWallet } from "@taquito/tezbridge-wallet";
  import { ThanosWallet } from "@thanos-wallet/dapp";
  import config from "../config";

  const connectWallet = async () => {
    // if user is not connected
    if (!$store.userAddress) {
      try {
        // checks if Thanos is installed
        if (await ThanosWallet.isAvailable()) {
          const wallet = new ThanosWallet("Tezos Token Faucet");
          await wallet.connect(config.network, { forcePermission: true });
          $store.Tezos.setWalletProvider(wallet);
          store.updateUserAddress(wallet.pkh);
        } else {
          const wallet = new TezBridgeWallet();
          $store.Tezos.setWalletProvider(wallet);
          store.updateUserAddress(await wallet.getPKH());
        }
        // gets user's token balance
        if ($store.tokenType === "fa12") {
          const contract = await $store.Tezos.wallet.at(
            config[$store.tokenType][config.network]
          );
          const storage = await contract.storage();

          const account = await storage.ledger.get($store.userAddress);
          if (account) {
            store.updateUserBalance(account.balance.toNumber());
          } else {
            store.updateUserBalance(0);
          }
        } else if ($store.tokenType === "fa2_ft") {
          // FA2 contract with fungible tokens
          const contract = await $store.Tezos.wallet.at(
            config[$store.tokenType][config.network]
          );
          const storage = await contract.storage();

          const balance = await storage.assets.ledger.get($store.userAddress);
          if (balance) {
            store.updateUserBalance(balance.toNumber());
          } else {
            store.updateUserBalance(0);
          }
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      // disconnect user
      $store.Tezos.setWalletProvider(undefined);
      store.updateUserAddress(undefined);
      store.updateUserBalance(0);
    }
  };
</script>

<p class="checkbox-wallet">
  <input
    type="checkbox"
    on:click={connectWallet}
    class={`${!$store.userAddress ? 'warning' : 'success'}`} />
</p>
