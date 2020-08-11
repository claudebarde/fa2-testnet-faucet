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
          await wallet.connect(config.network);
          $store.Tezos.setWalletProvider(wallet);
          store.updateUserAddress(wallet.pkh);
        } else {
          const wallet = new TezBridgeWallet();
          $store.Tezos.setWalletProvider(wallet);
          store.updateUserAddress(await wallet.getPKH());
        }
        // gets user's token balance
        if ($store.contractType === "fa12Address") {
          const contract = await $store.Tezos.wallet.at(
            config[$store.contractType][config.network]
          );
          const storage = await contract.storage();

          const account = await storage.ledger.get($store.userAddress);
          if (account) {
            store.updateUserBalance(account.balance.toNumber());
          } else {
            store.updateUserBalance(0);
          }
        } else {
          // FA2 contract
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
