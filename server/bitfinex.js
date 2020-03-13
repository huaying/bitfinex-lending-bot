const { RESTv2 } = require("bfx-api-node-rest");
const { FundingOffer } = require("bfx-api-node-models");
const config = require("./config");

const client = new RESTv2({
  apiKey: config.API_KEY,
  apiSecret: config.API_SECRET,
  transform: true
});

const DEFAULT_CCY = "USD";

async function getBalance(ccy = DEFAULT_CCY) {
  const wallets = await client.wallets();
  const wallet = wallets.find(w => w.type === "funding" && w.currency === ccy);
  if (wallet) {
    return wallet.balance;
  }
  throw Error(`Can't retrieve your funding wallet(${ccy})`);
}

async function getCurrentLending(ccy = DEFAULT_CCY) {
  // get current active lending
  return client.fundingCredits(`f${ccy}`).map(c => ({
    amount: c.amount,
    rate: c.rate,
    period: c.period,
    time: c.mtsOpening
  }));
}

async function cancelAllFundingOffers(ccy = DEFAULT_CCY) {
  return client.cancelAllFundingOffers({ currency: ccy });
}

async function submitFundingOffer({
  rate,
  amount,
  period = 2,
  ccy = DEFAULT_CCY
}) {
  return client.submitFundingOffer(
    new FundingOffer({
      type: "LIMIT",
      symbol: `f${ccy}`,
      rate,
      amount,
      period
    })
  );
}

async function getFundingBook(ccy = DEFAULT_CCY) {
  const book = await client.orderBook(`f${ccy}`);
  return {
    request: book.filter(item => item[3] < 0),
    offer: book.filter(item => item[3] > 0)
  };
}

async function getFundingEarning(ccy = DEFAULT_CCY) {
  const ONE_DAY_IN_MS = 86400000;
  const now = Date.now();
  const res = await client.ledgers(
    { ccy, category: 28 },
    now - ONE_DAY_IN_MS * 30,
    now,
    500
  );
  const earnings = res
    .map(r => ({
      id: r.id,
      amount: r.amount,
      balance: r.balance,
      mts: r.mts
    }))
    .reverse();
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
