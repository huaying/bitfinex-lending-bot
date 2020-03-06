const express = require("express");
const cors = require("cors");

const bitfinext = require("./bitfinex");
const { compoundInterest } = require("./utils");
const scheduler = require('./scheduler');
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
  let earnings = [];
  await db.read();
  if (db.has('earnings').value()) {
    earnings = db.get('earnings').takeRight(30).value().reverse();
  }

  return res.status(200).json({ balance, lending, earnings });
});

app.listen(port, () => {
  console.log(`bitfinex lending bot api on port ${port}!`)
  scheduler();
}
);
