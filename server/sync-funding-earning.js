const bitfinext = require("./bitfinex");
const { getFundingEarning } = bitfinext;

const db = require("./db");

async function main() {
  const earnings = (await getFundingEarning()).map(e => {
    e._id = e.id;
    delete e.id;
    return e;
  });

  const last = await db.earnings.findOne().sort({ _id: -1 });

  if (last === null) {
    db.earnings.insert(earnings);
    console.log(`Finished: ${earnings.length} record added.`);
  } else {
    const updated = earnings.filter(e => e._id > last._id);
    db.earnings.insert(updated);
    console.log(`Finished: ${updated.length} record added.`);
  }
}

module.exports = main;

if (require.main === module) {
  main();
}
