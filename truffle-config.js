const { alice } = require("./scripts/sandbox/accounts");
const faucet = require("./faucet");

module.exports = {
  // see <http://truffleframework.com/docs/advanced/configuration>
  // for more details on how to specify configuration options!
  networks: {
    development: {
      host: "http://localhost",
      port: 8732,
      network_id: "*",
      secretKey: alice.sk,
      type: "tezos"
    },
    carthagenet: {
      host: "https://carthagenet-tezos.giganode.io",
      port: 443,
      network_id: "*",
      type: "tezos",
      secretKey: faucet.sk
    },
    delphinet: {
      host: "https://delphinet-tezos.giganode.io",
      port: 443,
      network_id: "*",
      type: "tezos",
      secretKey: faucet.sk
    },
    mainnet: {
      host: "https://mainnet-tezos.giganode.io",
      port: 443,
      network_id: "*",
      type: "tezos"
    },
    zeronet: {
      host: "https://zeronet.smartpy.io",
      port: 443,
      network_id: "*",
      type: "tezos"
    }
  }
};
