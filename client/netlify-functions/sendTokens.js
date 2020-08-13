const { Tezos } = require("@taquito/taquito");
const { InMemorySigner } = require("@taquito/signer");
const { SECRET_KEY } = process.env;

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const req = JSON.parse(event.body);

  try {
    if (req.amount > 100) throw "Invalid amount";

    /*if (Date.now() < LAST_TRANSFER + 15 * 60 * 60 * 1000)
      throw "New transfers become available after 15 minutes.";*/

    // 15 minutes between each transfer
    Tezos.setProvider({
      rpc: "https://carthagenet.smartpy.io",
      signer: new InMemorySigner(SECRET_KEY)
    });
    const op = await Tezos.contract.transfer({
      to: req.address,
      amount: req.amount
    });
    //await op.confirmation();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        res: "success",
        opHash: op.hash
      })
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 405,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        res: "error",
        error
      })
    };
  }
};
