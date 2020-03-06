function compoundInterest(rate) {
  return Math.pow(1 + rate, 365) - 1
}

function toTime(arg) {
  const time = (arg) ? new Date(arg) : new Date();
  return time.toLocaleString("en-us");
}

function readableLend(lend) {
  return {
    amount: Number(lend.amount.toFixed(2)),
    period: lend.period,
    rate: Number(compoundInterest(lend.rate).toFixed(4)),
    exp: toTime(lend.time + lend.period * 86400000),
  }
}

module.exports = {
  toTime,
  compoundInterest,
  readableLend
}