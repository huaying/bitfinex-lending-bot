const express = require("express");
const cors = require("cors");
const NodeCache = require("node-cache");

const bitfinext = require("./bitfinex");
const { compoundInterest, getLowRate } = require("./utils");
const scheduler = require("./scheduler");
const db = require("./db");

const app = express();
const port = 3001;
const cache = new NodeCache();

app.use(cors());

app.get("/api/data", async (req, res) => {
  const getDataByCurrency = async ccy => {
    const balance = await bitfinext.getBalance(ccy);
    const availableBalance = await bitfinext.getAvailableBalance(ccy);
    const lending = (await bitfinext.getCurrentLending(ccy)).map(l => ({
      amount: l.amount,
      period: l.period,
      rate: compoundInterest(l.rate).toFixed(4),
      exp: l.time + l.period * 86400000
    }));

    const rate = compoundInterest(await getLowRate(ccy)).toFixed(4);

    // take only recently 30 days
    const day30diff = 30 * 24 * 3600 * 1000;
    const day30ago = Date.now() - day30diff;
    const earnings = await db.earnings
      .find({
        mts: { $gt: day30ago },
        currency: ccy
      })
      .sort({ _id: -1 });

    return { ccy, balance, availableBalance, lending, earnings, rate };
  };

  let data = cache.get("data");
  if (data) {
    return res.status(200).json(data);
  }

  const usdData = await getDataByCurrency("USD");
  const ustData = await getDataByCurrency("UST");
  data = [usdData, ustData];

  cache.set("data", data, 10);
  return res.status(200).json(data);
});

app.listen(port, () => {
  console.log(`bitfinex lending bot api on port ${port}!`);
  scheduler();
});
