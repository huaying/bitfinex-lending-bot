const bitfinext = require("./bitfinex");
const {
  getFundingEarning
} = bitfinext;

const db = require('./db');

async function main() {
  const earnings = await getFundingEarning();
  let updated = earnings;

  if (!db.has('earnings').value()) {
    db.defaults({ earnings }).write();
  } else {
    const lastId = db.get('earnings').last().value().id;
    updated = earnings.filter(e => e.id > lastId);
    db.get('earnings').push(...updated).write();
  }

  console.log(`Finished: ${updated.length} record added.`);
}

module.exports = main;

if (require.main === module) {
  main();
}