const { scheduleJob } = require("node-schedule");
const { showTime } = require("./function");

const { writeLog_throw, StartLogger } = require("../logService");

// ----- MANAGE EVERY 1 MINUTE -----
scheduleJob("0 */1 * * * *", async function () {
  try {
    showTime();
  } catch (error) {
    handlerError(error);
  }
});

// ----- MANAGE 00:00:00+07:00 -----
scheduleJob("0 0 17 * * *", async function () {
  try {
    StartLogger();
  } catch (error) {
    handlerError(error);
  }
});

function handlerError() {
  if (error && error.message) {
    console.log(error);

    writeLog_throw(error, "scheduleJob_(0 */5 * * * *)");
  }
}
