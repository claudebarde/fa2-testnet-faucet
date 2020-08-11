import { writable } from "svelte/store";

const initialState = {
  userAddress: undefined,
  userBalance: 0,
  Tezos: undefined,
  fa12_instance: undefined,
  tokenType: true, // false for fa2, true for fa1.2
  contractType: "fa12Address"
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
  updateFA12_instance: instance => {
    store.update(store => ({ ...store, fa12_instance: instance }));
  },
  updateContractType: contractType => {
    store.update(store => ({ ...store, contractType }));
  }
};

export default state;
