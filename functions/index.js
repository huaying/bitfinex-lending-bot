const functions = require("firebase-functions");
const bitfinext = require("./bitfinex");

exports.helloWorld = functions.https.onRequest(async (request, response) => {
  const balance = await bitfinext.getBalance();
  console.log("balance", balance);
  response.send("123");
});
