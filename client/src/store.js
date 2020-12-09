import { writable } from "svelte/store";
import config from "./config";

const initialState = {
  userAddress: undefined,
  userBalance: 0,
  Tezos: undefined,
  tokenType: "fa2_ft", // fa12 || fa2_ft || fa2_nft || tezzies
  recipientAddress: "",
  network: config.network
};

const store = writable(initialState);

const state = {
  subscribe: store.subscribe,
  updateUserAddress: address => {
    store.update(store => ({ ...store, userAddress: address }));
  },
  updateUserBalance: balance => {
    store.update(store => ({ ...store, userBalance: balance }));
  },
  updateTezos: Tezos => {
    store.update(store => ({ ...store, Tezos }));
  },
  updateTokenType: tokenType => {
    store.update(store => ({ ...store, tokenType }));
  },
  updateRecipientAddress: address => {
    store.update(store => ({ ...store, recipientAddress: address }));
  },
  updateNetwork: network => {
    store.update(store => ({ ...store, network }));
  }
};

export default state;
