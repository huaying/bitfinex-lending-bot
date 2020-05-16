const { getPeriod } = require("./utils");

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

module.exports = {
  splitEqually
};
