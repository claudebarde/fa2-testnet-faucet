export default {
  //network: process.env.NODE_ENV === "development" ? "sandbox" : "carthagenet",
  network: "carthagenet",
  rpc: {
    sandbox: "http://localhost:8732",
    carthagenet: "https://carthagenet.smartpy.io"
  },
  fa2_ft: {
    sandbox: "KT1TJjyHbm9dnERLg2RY7TFT3JTTp2jmYjrs",
    carthagenet: "KT1EnN5VuPNQaz6K43Sv5Xiu3XyUWpVJNU7q"
  },
  fa12: {
    sandbox: "KT1EUMMqXA6oKKh5GggCEaZGkWr17bENPcaE",
    carthagenet: "KT1Eapit2PHu8hspMJJDnGCK1LVnhbY43rKj"
  },
  netlifyDevPort: 65460
};
