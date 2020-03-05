const schedule = require('node-schedule');
const checkAndSubmitOffer = require('./submit-funding-offer');
const syncEarning = require('./sync-funding-earning');

module.exports = () => {
  console.log('start scheduler');
  schedule.scheduleJob('*/5 * * * *', function () {
    checkAndSubmitOffer();
  });

  schedule.scheduleJob('32 9 * * *', function () {
    syncEarning();
  });

  // double check
  schedule.scheduleJob('0 12 * * *', function () {
    syncEarning();
  });
}