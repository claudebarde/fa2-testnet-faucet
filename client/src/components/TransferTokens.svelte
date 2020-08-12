<script>
  import { validateAddress } from "@taquito/utils";
  import store from "../store";

  export let fungibleTokens, nonFungibleTokens;

  let loading = false;
  let success = false;
  let validAddress = false;

  $: if ($store.recipientAddress) {
    validAddress = isAddressValid($store.recipientAddress);
  }

  const isAddressValid = address => {
    if (validateAddress(address) === 3) {
      return true;
    } else {
      return false;
    }
  };

  const addRecipientAddress = event => {
    const address = event.target.value;
    if (isAddressValid(address)) {
      validAddress = true;
      store.updateRecipientAddress(address);
    } else {
      validAddress = false;
    }
  };

  const transferTokens = async () => {
    if (isAddressValid($store.recipientAddress)) {
      loading = true;
      // address is valid
      if ($store.tokenType) {
        // FA1.2
        // sends transaction to contract
        try {
          const op = await $store.fa12_instance.methods
            .mint($store.recipientAddress, fungibleTokens)
            .send();
          console.log("Tx hash:", op.opHash);
          await op.confirmation();
          // when tx succeeds
          store.updateUserBalance(
            parseInt($store.userBalance) + parseInt(fungibleTokens)
          );
        } catch (error) {
          console.error(error);
        } finally {
          loading = false;
          success = true;
          setTimeout(() => (success = false), 3000);
        }
      } else {
        // FA2
        try {
          // NFT doesn't work for now
          if ($store.contractType === "fa2_nft")
            throw new Error("NFT is coming soon!");
          // sends transaction to contract
          const op = await $store.fa2_instance.methods
            .mint_tokens([
              { owner: $store.recipientAddress, amount: fungibleTokens }
            ])
            .send();
          console.log("Tx hash:", op.opHash);
          await op.confirmation();
          // when tx succeeds
          store.updateUserBalance(
            parseInt($store.userBalance) + parseInt(fungibleTokens)
          );
        } catch (error) {
          console.error(error);
        } finally {
          loading = false;
          success = true;
          setTimeout(() => (success = false), 3000);
        }
      }
    } else {
      // address is not valid
    }
  };
</script>

<style>
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
</style>

<div class="recipient-container">
  <div class="recipient-container__input">
    <input
      type="text"
      placeholder="Recipient's address"
      value={$store.recipientAddress}
      on:input={addRecipientAddress}
      disabled={loading} />
  </div>
  <button
    on:click={transferTokens}
    disabled={loading || success || !$store.recipientAddress || !validAddress}>
    {#if loading}
      <i class="fas fa-atom fa-lg fa-spin" />
    {:else}
      <i
        class="icon far fa-thumbs-up fa-lg"
        class:success
        class:disabled={!validAddress} />
    {/if}
  </button>
</div>
