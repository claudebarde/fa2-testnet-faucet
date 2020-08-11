export default {
  network: process.env.NODE_ENV === "development" ? "sandbox" : "carthagenet",
  rpc: {
    sandbox: "http://localhost:8732",
    carthagenet: "https://carthagenet.smartpy.io"
  },
  fa2Address: {
    sandbox: "KT1TJjyHbm9dnERLg2RY7TFT3JTTp2jmYjrs",
    carthagenet: "KT1PZFaUB1QhmnM9LpUixYpRKZ5GCQr64aFB"
  },
  fa12Address: {
    sandbox: "KT1EUMMqXA6oKKh5GggCEaZGkWr17bENPcaE",
    carthagenet: "KT1Eapit2PHu8hspMJJDnGCK1LVnhbY43rKj"
  }
};
