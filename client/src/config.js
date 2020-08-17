export default {
  network: process.env.NODE_ENV === "development" ? "sandbox" : "carthagenet",
  //network: "carthagenet",
  rpc: {
    sandbox: "http://localhost:8732",
    carthagenet: "https://carthagenet.smartpy.io"
    //carthagenet: "https://testnet-tezos.giganode.io"
  },
  fa2_ft: {
    sandbox: "KT1SFLB3GoXZ2WeD4mbr7oASG6TeZ3avBzq1",
    carthagenet: "KT1C1eUuS7Y5FsaXryJse7vVM7CfFz6LAJaX"
    //carthagenet: "KT1EnN5VuPNQaz6K43Sv5Xiu3XyUWpVJNU7q"
  },
  fa12: {
    sandbox: "KT1DSJsJBFXQzNWpRMq3DtUnL5RYzQCFiMZs",
    carthagenet: "KT1WWkQHoxU6bfwK2Sa3wc4S7PyvGVfVfk3b"
  },
  netlifyDevPort: 64636
};
