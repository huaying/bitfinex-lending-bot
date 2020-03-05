const express = require("express");
const cors = require("cors");

const bitfinext = require("./bitfinex");
const { compoundInterest } = require("./utils");
const db = require('./db');

const app = express();
const port = 3001;

app.use(cors());

app.get("/api/data", async (req, res) => {
  const balance = await bitfinext.getBalance();
  const lending = (await bitfinext.getCurrentLending()).map(l => ({
    amount: l.amount,
    period: l.period,
    rate: compoundInterest(l.rate).toFixed(4),
    exp: l.time + l.period * 86400000
  }));

  // take only recently 30 days
  let earngins = [];
  if (db.has('earnings').value()) {
    earngins = db.get('earnings').takeRight(30).value();
  }  

  return res.status(200).json({ balance, lending, earngins });
});

app.listen(port, () =>
  console.log(`bitfinex lending bot api on port ${port}!`)
);
