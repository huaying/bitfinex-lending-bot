const { RESTv2 } = require("bfx-api-node-rest");
const { FundingOffer } = require("bfx-api-node-models");
const { API_KEY, API_SECRET } = require("./config");

const rest = new RESTv2({
  apiKey: API_KEY,
  apiSecret: API_SECRET,
  transform: true
});

async function getRate() {
  const OFFER_START_IDX = 25;
  const EXPECTED_AMOUNT = 50000;
  const RATE_OFFSET = 0.00000001;

  // get funding book
  const book = await rest.orderBook("fUSD");
  const offers = book.slice(OFFER_START_IDX);

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

async function getBalance() {
  // get your total USD from the funding wallet
  const wallets = await rest.wallets();
  const wallet = wallets.find(
    w => w.type === "funding" && w.currency === "USD"
  );
  if (wallet) {
    return wallet.balance;
  }
  return null;
}

async function getFundingOffers(balance, lending, rate) {
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

  return amounts.map(
    amount =>
      new FundingOffer({
        type: "LIMIT",
        symbol: "fUSD",
        rate,
        amount,
        period: 2
      })
  );
}

async function main() {
  await rest.cancelAllFundingOffers();

  const balance = await getBalance();

  // get current active lending
  const lending = await rest.fundingCredits();

  const rate = await getRate();

  const offers = await getFundingOffers(balance, lending, rate);

  // submit funding offer
  offers.forEach(offer => rest.submitFundingOffer(offer));
}

main();
