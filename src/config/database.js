const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "ArminCloud",
  "user",
  "1qaz!QAZ",
  {
    host: "localhost",
    dialect: "mysql",
    logging: false
  }
);

module.exports = sequelize;
