const bitfinext = require("./bitfinex");
const {
  getBalance,
  getAvailableBalance,
  getCurrentLending,
  cancelAllFundingOffers,
  submitFundingOffer
} = bitfinext;
const {
  readableLend,
  toTime,
  readableOffer,
  sleep,
  asyncForEach
} = require("./utils");
const Stratege = require("./strategy");

async function getFundingOffers(avaliableBalance, ccy) {
  return Stratege.splitPyramidally(avaliableBalance, ccy);
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
      ...readableOffer(o),
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
async function main({ showDetail = false, ccy = "USD" } = {}) {
  await cancelAllFundingOffers(ccy);

  const balance = await getBalance(ccy);
  const lending = await getCurrentLending(ccy);
  const avaliableBalance = await getAvailableBalance(ccy);
  const offers = await getFundingOffers(avaliableBalance, ccy);

  // submit funding offer
  if (process.env.NODE_ENV === "development") {
    offers.forEach(offer => console.log(readableOffer(offer)));
  } else {
    asyncForEach(offers, async offer => {
      await submitFundingOffer(offer);
      await sleep(500);
    });
  }

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
