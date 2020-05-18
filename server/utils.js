const { getFundingBook } = require("./bitfinex");
const { Rate: rateConfig, Period: periodConfig } = require("./config");

function compoundInterest(rate) {
  return Math.pow(1 + rate, 365) - 1;
}

function toTime(arg) {
  const time = arg ? new Date(arg) : new Date();
  return time.toLocaleString("en-us");
}

function readableRate(rate) {
  return Number(compoundInterest(rate).toFixed(4));
}

function readableLend(lend) {
  return {
    amount: Number(lend.amount.toFixed(2)),
    period: lend.period,
    rate: readableRate(lend.rate),
    exp: toTime(lend.time + lend.period * 86400000)
  };
}

function readableOffer(offer) {
  return {
    amount: Number(offer.amount.toFixed(2)),
    period: offer.period,
    rate: readableRate(offer.rate)
  };
}

function getPeriod(rate) {
  // TODO: dynamically decide the mapping
  const mapping = periodConfig.PERIOD_MAP;

  const annual_rate = compoundInterest(rate);
  for (let [r, p] of mapping) {
    if (annual_rate >= r) {
      return p;
    }
  }
  return 2;
}

async function getRate(ccy, expected_over_amount = 50000) {
  const RATE_OFFSET = 0.00000001;

  // get funding book
  const offers = (await getFundingBook(ccy)).offer;

  let total = 0;
  let idx = 0;
  for (; idx < offers.length; idx++) {
    total += offers[idx][3] * offers[idx][2];
    if (total > expected_over_amount) {
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

function step(mapping, key) {
  for (let [k, v] of mapping) {
    if (key >= k) {
      return v;
    }
  }
  return mapping[mapping.length - 1][1];
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

module.exports = {
  toTime,
  compoundInterest,
  readableRate,
  readableLend,
  readableOffer,
  getPeriod,
  getRate,
  getLowRate,
  step,
  sleep,
  asyncForEach
};
