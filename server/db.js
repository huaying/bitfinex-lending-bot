const Datastore = require("nedb-promises");
const db = {};

db.earnings = Datastore.create("db/earning.db");

module.exports = db;
