const { sequelize } = require("../models");
const { writeLog_throw } = require("../utils/logService");

async function syncDB_force(param = false) {
  try {
    await sequelize.sync({ force: param, logging: true });

    return true;
  } catch (error) {
    writeLog_throw(error, "syncDB_force");

    return false;
  }
}

async function testConnect() {
  try {
    await sequelize.authenticate({ logging: false });

    return true;
  } catch (error) {
    writeLog_throw(error, "testConnect");

    return false;
  }
}

module.exports = { syncDB_force, testConnect };
