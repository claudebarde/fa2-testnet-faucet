<script>
  import store from "../store";
</script>

<style>
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
</style>

{#if $store.userAddress}
  <div class="address-container">
    <div class="img-container">
      {#if $store.userAddress}
        <img
          src={`https://services.tzkt.io/v1/avatars/${$store.userAddress}`}
          alt="avatar" />
      {/if}
    </div>
    <div style="width:100%">
      <div class="address-container__text">
        <div>
          <p>Status: Connected</p>
          <p
            class="subtitle"
            style="cursor:pointer"
            on:click={() => store.updateRecipientAddress($store.userAddress)}>
            Address: {$store.userAddress.slice(0, 7) + '...' + $store.userAddress.slice(-7)}
          </p>
        </div>
        <div style="text-align:right">
          <p>Balance</p>
          {#if $store.userBalance !== undefined}
            <p class="subtitle">
              {$store.userBalance.toLocaleString('en-US')}
              {#if $store.userBalance !== 'Not available'}tokens{/if}
            </p>
          {:else}
            <p class="subtitle">---</p>
          {/if}
        </div>
      </div>
    </div>
  </div>
{:else}
  <div class="address-container">Connect your wallet to continue</div>
{/if}
