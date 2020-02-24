function compoundInterest (rate) {
  return Math.pow(1 + rate, 365) - 1
}

function toTaipeiTime (arg) {
  const time = (arg) ? new Date(arg) : new Date();
  return time.toLocaleString("en-us", { timeZone: "Asia/Taipei" });
}

function readableLend (lend) {
  return {
    amount: Number(lend.amount.toFixed(2)),
    period: lend.period,
    rate: Number(compoundInterest(lend.rate).toFixed(4)),
    exp: toTaipeiTime(lend.time + lend.period * 86400000),
  } 
}

module.exports = {
  toTaipeiTime,
  compoundInterest,
  readableLend
}