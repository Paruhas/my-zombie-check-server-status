const { scheduleJob } = require("node-schedule");
const { showTime, fetchCheckServerStatus } = require("./function");
const { writeLog_throw, StartLogger } = require("../logService");

const isProduction = process.env.NODE_ENV === "production";

// ----- MANAGE EVERY 1 MINUTE -----
scheduleJob("0 */1 * * * *", async function () {
  try {
    showTime();

    if (isProduction) {
      await fetchCheckServerStatus();
    }
  } catch (error) {
    handlerError(error), "0 */1 * * * *";
  }
});

// ----- MANAGE 00:00:00+07:00 -----
scheduleJob("0 0 17 * * *", async function () {
  try {
    StartLogger();
  } catch (error) {
    handlerError(error, "0 0 17 * * *");
  }
});

function handlerError(error, scheduleJob) {
  if (error && error.message && scheduleJob) {
    console.error(error);

    writeLog_throw(error, scheduleJob);
  }
}
