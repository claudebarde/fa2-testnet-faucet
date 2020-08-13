const { SECRET_KEY } = process.env;

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  console.log(event.body);
  const req = JSON.parse(event.body);

  return {
    statusCode: 200,
    body: `${req.amount} to be sent to ${req.address}`
  };
};
