const express = require("express");
const cors = require("cors");

const bitfinext = require("./bitfinex");
const { compoundInterest, getLowRate } = require("./utils");
const scheduler = require("./scheduler");
const db = require("./db");

const app = express();
const port = 3001;

app.use(cors());

app.get("/api/data", async (req, res) => {
  const ccyDataPromise = async ccy => {
    const balance = await bitfinext.getBalance(ccy);
    const lending = (await bitfinext.getCurrentLending(ccy)).map(l => ({
      amount: l.amount,
      period: l.period,
      rate: compoundInterest(l.rate).toFixed(4),
      exp: l.time + l.period * 86400000
    }));

    const rate = compoundInterest(await getLowRate(ccy)).toFixed(4);

    // take only recently 30 days
    let earnings = [];
    await db.read();
    if (db.has("earnings").value()) {
      earnings = db
        .get("earnings")
        .takeRight(30)
        .value()
        .reverse();
    }

    return Promise.resolve({ ccy, balance, lending, earnings, rate });
  };

  const getData = async () =>
    Promise.all(["USD", "UST"].map(ccy => ccyDataPromise(ccy)));

  const data = await getData();
  return res.status(200).json(data);
});

app.listen(port, () => {
  console.log(`bitfinex lending bot api on port ${port}!`);
  scheduler();
});
