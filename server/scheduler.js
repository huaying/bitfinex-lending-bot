const schedule = require('node-schedule');
const checkAndSubmitOffer = require('./submit-funding-offer');
const syncEarning = require('./sync-funding-earning');
const { toTime } = require('./utils');

module.exports = () => {
  console.log('start scheduler');

  schedule.scheduleJob('*/5 * * * *', function () {
    console.log(`${toTime()}: Check and submit funding offers automatically`)
    checkAndSubmitOffer();
  });

  // TODO: the time might be set differently if you have non taipei timezone
  schedule.scheduleJob('32 9 * * *', function () {
    console.log(`${toTime()}: Sync Earning`)
    syncEarning();
  });
}