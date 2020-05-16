const schedule = require("node-schedule");
const checkAndSubmitOffer = require("./submit-funding-offer");
const syncEarning = require("./sync-funding-earning");
const { toTime } = require("./utils");

module.exports = () => {
  console.log("start scheduler");

  schedule.scheduleJob("*/3 * * * *", async function () {
    console.log(`${toTime()}: Check and submit funding offers automatically`);
    await checkAndSubmitOffer();
    await checkAndSubmitOffer({ ccy: "UST" });
  });

  // TODO: the time might be set differently if you have non taipei timezone
  ["35 9 * * *", "40 9 * * *", "50 9 * * *"].forEach(rule => {
    schedule.scheduleJob(rule, function () {
      console.log(`${toTime()}: Sync Earning`);
      syncEarning();
    });
  });
};
