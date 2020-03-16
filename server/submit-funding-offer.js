const bitfinext = require("./bitfinex");
const {
  getBalance,
  getCurrentLending,
  cancelAllFundingOffers,
  submitFundingOffer
} = bitfinext;
const {
  readableLend,
  toTime,
  getPeriod,
  getRate,
  compoundInterest
} = require("./utils");

async function getFundingOffers(balance, lending, rate, ccy) {
  const MIN_TO_LEND = 50;
  const NUM_ALL_IN = 1100;
  const SPLIT_UNIT = 1000;

  const lendingAmount = lending.reduce((total, c) => total + c.amount, 0);
  let remain = balance - lendingAmount;

  const amounts = [];
  while (remain > NUM_ALL_IN) {
    amounts.push(SPLIT_UNIT);
    remain -= SPLIT_UNIT;
  }

  if (remain <= NUM_ALL_IN && remain >= MIN_TO_LEND) {
    amounts.push(remain);
  }

  const period = getPeriod(rate);
  return amounts.map(amount => ({
    rate,
    amount,
    period,
    ccy
  }));
}

function printStatus(balance, lending, offers) {
  console.log("=========================================================");
  const time = toTime();
  console.log(`Time: ${time}`);
  console.log(`Balance: $${balance}`);
  console.log("Status:");
  const items = lending.map(l => ({
    ...readableLend(l),
    executed: true
  }));

  offers.forEach(o => {
    items.push({
      amount: Number(o.amount.toFixed(2)),
      period: 2,
      rate: Number(compoundInterest(o.rate).toFixed(4)),
      exp: null,
      executed: false
    });
  });
  if (lending.length) {
    console.table(items);
  }
}

/*
  The bot currently only monitors and auto submit offers for USD.
  You need to operate USDt maually.
*/
async function main({ showDetail = false, ccy = "USD" }) {
  await cancelAllFundingOffers(ccy);

  const balance = await getBalance(ccy);
  const lending = await getCurrentLending(ccy);
  const rate = await getRate(ccy);
  const offers = await getFundingOffers(balance, lending, rate, ccy);

  // submit funding offer
  offers.forEach(offer => submitFundingOffer(offer));

  if (showDetail) {
    printStatus(balance, lending, offers);
  }
}

module.exports = main;

if (require.main === module) {
  let ccy = "USD";
  if (process.argv.length > 2 && process.argv[2] === "ust") {
    ccy = "UST";
  }
  main({ showDetail: true, ccy });
}
