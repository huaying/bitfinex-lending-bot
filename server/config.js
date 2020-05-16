const dotenv = require("dotenv");
const customConfig = require("./custom-config");
dotenv.config();

module.exports = {
  ...customConfig,
  API_KEY: process.env.API_KEY,
  API_SECRET: process.env.API_SECRET
};
