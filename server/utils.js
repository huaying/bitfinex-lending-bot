const { getFundingBook } = require("./bitfinex");

function compoundInterest(rate) {
  return Math.pow(1 + rate, 365) - 1;
}

function toTime(arg) {
  const time = arg ? new Date(arg) : new Date();
  return time.toLocaleString("en-us");
}

function readableLend(lend) {
  return {
    amount: Number(lend.amount.toFixed(2)),
    period: lend.period,
    rate: Number(compoundInterest(lend.rate).toFixed(4)),
    exp: toTime(lend.time + lend.period * 86400000)
  };
}

function getPeriod(rate) {
  // TODO: dynamically decide the mapping
  const mapping = [
    [0.3, 30],
    [0.2, 10],
    [0.15, 5],
    [0.12, 3]
  ];

  const annual_rate = compoundInterest(rate);
  for (let [r, p] of mapping) {
    if (annual_rate >= r) {
      return p;
    }
  }
  return 2;
}

async function getRate(ccy) {
  const EXPECTED_AMOUNT = 50000;
  const RATE_OFFSET = 0.00000001;

  // get funding book
  const offers = (await getFundingBook(ccy)).offer;

  let total = 0;
  let idx = 0;
  for (; idx < offers.length; idx++) {
    total += offers[idx][3] * offers[idx][2];
    if (total > EXPECTED_AMOUNT) {
      break;
    }
  }
  const rate =
    idx === offers.length ? offers[idx - 1][0] : offers[idx][0] - RATE_OFFSET;

  return rate;
}

async function getLowRate(ccy) {
  const offers = (await getFundingBook(ccy)).offer;

  return offers[0][0];
}

module.exports = {
  toTime,
  compoundInterest,
  readableLend,
  getPeriod,
  getRate,
  getLowRate
};
