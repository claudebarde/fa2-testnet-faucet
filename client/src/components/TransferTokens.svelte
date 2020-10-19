<script>
  import { validateAddress } from "@taquito/utils";
  import { MichelsonMap } from "@taquito/taquito";
  import store from "../store";
  import config from "../config";

  export let fungibleTokens, nonFungibleTokens;

  let loading = false;
  let success = false;
  let error = false;
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
      if ($store.tokenType === "fa12") {
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
          error = true;
        } finally {
          loading = false;
          success = true;
          setTimeout(() => {
            success = false;
            error = false;
          }, 3000);
        }
      } else if ($store.tokenType === "fa2_ft") {
        // FA2 FT
        try {
          // sends transaction to contract
          const op = await $store.fa2_ft_instance.methods
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
          success = true;
        } catch (err) {
          console.error(err);
          error = true;
        } finally {
          loading = false;
          setTimeout(() => {
            success = false;
            error = false;
          }, 3000);
        }
      } else if ($store.tokenType === "fa2_nft") {
        // FA2 NFT
        try {
          // token data
          const from = $store.userAddress;
          const symbol = "TQT";
          const decimals = 0;
          const extras = new MichelsonMap();

          const tokenId = Math.round(Date.now() * Math.random());
          const name = Math.random().toString(36).substr(2, 9);
          const op = await $store.fa2_nft_instance.methods
            .mint_tokens(from, tokenId, symbol, name, decimals, extras)
            .send();

          console.log("Tx hash:", op.opHash);

          await op.confirmation();

          /*let batch = $store.Tezos.batch();
          for (let i = 0; i < nonFungibleTokens; i++) {
            // creates unique ID and name
            const tokenId = Math.round(Date.now() * Math.random());
            const name = Math.random().toString(36).substr(2, 9);
            // creates transaction
            batch = batch.withContractCall(
              $store.fa2_nft_instance.methods.mint_tokens(
                from,
                tokenId,
                symbol,
                name,
                decimals,
                extras
              )
            );
          }

          const batchOp = await batch.send();
          await batchOp.confirmation();
          if (isNaN($store.userBalance)) {
            store.updateUserBalance(nonFungibleTokens);
          } else {
            store.updateUserBalance(+$store.userBalance + +nonFungibleTokens);
          }
          success = true;*/
        } catch (err) {
          console.error(err);
          error = true;
        } finally {
          loading = false;
          setTimeout(() => {
            success = false;
            error = false;
          }, 3000);
        }
      } else if ($store.tokenType === "tezzies") {
        // transfer tezzies to address
        const url =
          process.env.NODE_ENV === "development"
            ? `http://localhost:${config.netlifyDevPort}/sendTokens`
            : `https://tezos-tokens-faucet.netlify.app/.netlify/functions/sendTokens`;
        try {
          // checks if last transfer was made more than 30 minutes ago
          if (window.localStorage) {
            const lastTransfer = window.localStorage.getItem("lastTransfer");
            if (
              lastTransfer &&
              Date.now() < parseInt(lastTransfer) + 30 * 60 * 60 * 1000
            ) {
              throw "New transfers become available after 30 minutes.";
            }
          }
          // sends request
          const response = await fetch(url, {
            body: JSON.stringify({
              address: $store.recipientAddress,
              amount: fungibleTokens
            }),
            method: "POST"
          });
          const data = await response.json();
          console.log(data);
          if (data.res === "success") {
            success = true;
            if (window.localStorage) {
              // prevents people from requesting tokens too often
              window.localStorage.setItem("lastTransfer", Date.now());
            }
          } else {
            error = true;
          }
        } catch (err) {
          console.error(err);
          error = true;
        } finally {
          loading = false;
          document.getElementById("transfer-button").blur();
          setTimeout(() => {
            success = false;
            error = false;
          }, 3000);
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
    id="transfer-button"
    on:click={transferTokens}
    disabled={loading || success || !$store.recipientAddress || !validAddress}>
    {#if loading}
      <i class="fas fa-atom fa-lg fa-spin" />
    {:else}
      <i
        class="icon far fa-thumbs-up fa-lg"
        class:success
        class:error
        class:disabled={!validAddress} />
    {/if}
  </button>
</div>
