const { SECRET_KEY, LAST_TRANSFER } = process.env;

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  const req = JSON.parse(event.body);
  console.log(process.env, req, LAST_TRANSFER);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({
      res: `${req.amount} to be sent to ${req.address}`
    })
  };
};
