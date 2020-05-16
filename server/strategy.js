const { getPeriod, getRate, step } = require("./utils");
const { Strategy: config } = require("./config");

const splitEqually = async (avaliableBalance, ccy) => {
  const CONFIG = config.splitEqually;
  const MIN_TO_LEND = CONFIG.MIN_TO_LEND;
  const NUM_ALL_IN = CONFIG.NUM_ALL_IN;
  const SPLIT_UNIT = CONFIG.SPLIT_UNIT;
  const rate = await getRate(ccy, CONFIG.RATE_EXPECTED_OVER_AMOUNT);

  const amounts = [];
  while (avaliableBalance > NUM_ALL_IN) {
    amounts.push(SPLIT_UNIT);
    avaliableBalance -= SPLIT_UNIT;
  }

  if (avaliableBalance <= NUM_ALL_IN && avaliableBalance >= MIN_TO_LEND) {
    amounts.push(avaliableBalance);
  }

  const period = getPeriod(rate);
  return amounts.map(amount => ({
    rate,
    amount,
    period,
    ccy
  }));
};

function getDerivedRate(l, h, x) {
  x = Math.max(l, Math.min(h, x));
  return 1 + (1 - (x - l) / (h - l)) * 0.1;
}

// default stratege
const splitPyramidally = async (avaliableBalance, ccy) => {
  const CONFIG = config.splitPyramidally;
  const MIN_TO_LEND = CONFIG.MIN_TO_LEND;
  const UP_BOUND_RATE = CONFIG.UP_BOUND_RATE;
  const LOW_BOUND_RATE = CONFIG.LOW_BOUND_RATE;
  const offers = [];
  const baseRate = await getRate(ccy, CONFIG.RATE_EXPECTED_OVER_AMOUNT);
  let amountInit = step(CONFIG.AMOUNT_INIT_MAP, baseRate);
  let amount;
  let rate;
  let i = 0;

  while (avaliableBalance > MIN_TO_LEND) {
    amount = Math.min(
      avaliableBalance,
      amountInit * Math.pow(CONFIG.AMOUNT_GROW_EXP, i)
    );
    amount = Math.floor(amount);
    rate =
      baseRate *
      Math.pow(getDerivedRate(LOW_BOUND_RATE, UP_BOUND_RATE, baseRate), i);

    offers.push({
      amount,
      rate,
      period: getPeriod(rate),
      ccy
    });
    avaliableBalance -= amount;
    i++;
  }

  return offers;
};

module.exports = {
  splitEqually,
  splitPyramidally
};
