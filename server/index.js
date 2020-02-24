const express = require("express");
const bitfinext = require("./bitfinex");
const { readableLend } = require('./utils');

const app = express();
const port = 3001;

app.get("/api/data", async (req, res) => {
  const balance = await bitfinext.getBalance();
  const lending = (await bitfinext.getCurrentLending()).map(l => readableLend(l));
  return res.status(200).json({ balance, lending });
});

app.listen(port, () => console.log(`bitfinex lending bot api on port ${port}!`))
