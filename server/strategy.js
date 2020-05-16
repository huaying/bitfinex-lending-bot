const { getPeriod, step } = require("./utils");

const splitEqually = (avaliableBalance, rate, ccy) => {
  const MIN_TO_LEND = 50;
  const NUM_ALL_IN = 1100;
  const SPLIT_UNIT = 1000;

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

const splitPyramidally = (avaliableBalance, baseRate, ccy) => {
  const MIN_TO_LEND = 50;
  const UP_BOUND_RATE = 0.001; // around 40% annual rate
  const LOW_BOUND_RATE = 0.0001; // around 4% annual rate
  const offers = [];
  let amountInit = step(
    [
      [0.0007, 1000],
      [0.0006, 700],
      [0.0005, 500],
      [0.0004, 350],
      [0.0003, 200],
      [0.0002, 100]
    ],
    baseRate
  );
  let amount;
  let rate;
  let i = 0;

  while (avaliableBalance > MIN_TO_LEND) {
    amount = Math.min(avaliableBalance, amountInit * Math.pow(1.2, i));
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
