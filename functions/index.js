const functions = require("firebase-functions");
const express = require("express");

const bitfinext = require("./bitfinex");

const app = express();

app.get("/data", async (req, res) => {
  const balance = await bitfinext.getBalance();
  const lending = await bitfinext.getCurrentLending();
  return res.status(200).json({ balance, lending });
});

exports.api = functions.https.onRequest(app);
