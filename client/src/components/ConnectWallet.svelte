<script>
  import store from "../store";
  import { TezBridgeWallet } from "@taquito/tezbridge-wallet";
  import { ThanosWallet } from "@thanos-wallet/dapp";
  import config from "../config";

  const connectWallet = async () => {
    // if user is not connected
    if (!$store.userAddress) {
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
      // gets user's balance
      const balance = await $store.Tezos.tz.getBalance($store.userAddress);
      store.updateUserBalance(balance);
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
