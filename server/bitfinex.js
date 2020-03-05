const { RESTv2 } = require("bfx-api-node-rest");
const { FundingOffer } = require("bfx-api-node-models");
const config = require("./config");

const client = new RESTv2({
  apiKey: config.API_KEY,
  apiSecret: config.API_SECRET,
  transform: true
});

async function getBalance() {
  // get your total USD from the funding wallet
  const wallets = await client.wallets();
  const wallet = wallets.find(
    w => w.type === "funding" && w.currency === "USD"
  );
  if (wallet) {
    return wallet.balance;
  }
  throw Error("Can't retrieve your funding wallet(USD)");
}

async function getCurrentLending() {
  // get current active lending
  return client.fundingCredits().map(c => ({
    amount: c.amount,
    rate: c.rate,
    period: c.period,
    time: c.mtsOpening
  }));
}

async function cancelAllFundingOffers() {
  return client.cancelAllFundingOffers();
}

async function submitFundingOffer({ rate, amount, period = 2 }) {
  return client.submitFundingOffer(
    new FundingOffer({
      type: "LIMIT",
      symbol: "fUSD",
      rate,
      amount,
      period
    })
  );
}

async function getFundingBook() {
  const book = await client.orderBook("fUSD");
  return {
    request: book.filter(item => item[3] < 0),
    offer: book.filter(item => item[3] > 0)
  };
}

async function getFundingEarning() {
  const ONE_DAY_IN_MS = 86400000;
  const now = Date.now();
  const res = await client.ledgers({ ccy: 'USD', category: 28 }, now - ONE_DAY_IN_MS * 30, now, 500);
  const earnings = res.map(r => ({
    id: r.id,
    amount: r.amount,
    balance: r.balance,
    mts: r.mts
  })).reverse();
  return earnings;
}

module.exports = {
  client,
  getBalance,
  getCurrentLending,
  cancelAllFundingOffers,
  submitFundingOffer,
  getFundingBook,
  getFundingEarning
};
