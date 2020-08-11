import { writable } from "svelte/store";

const initialState = {
  userAddress: undefined,
  userBalance: 0,
  Tezos: undefined
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
  }
};

export default state;
