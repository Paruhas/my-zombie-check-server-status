const axios = require("axios");
const dayjs = require("../../libs/Day");
const { Buffer } = require("node:buffer");
const { restartPm2ByName } = require("../pm2");
const { writeLog_throw, writeLog_restartServer } = require("../logService");

const isProduction = process.env.NODE_ENV === "production";

exports.showTime = () => {
  var object_time = {
    TH_time: dayjs().tz("Asia/Bangkok").format(),
    UTC_time: dayjs().utc().format(),
  };

  return console.table(object_time);
};

exports.fetchCheckServerStatus = async () => {
  try {
    const { checker, result } = await checkServerStatus();

    if (!checker && result) {
      const id = dayjs().utc().valueOf();
      const start = id;
      const date = dayjs(id).utc().format("YYYY-MM-DD HH:mm:ss:SSSZ");

      console.log(
        `[CHECK_SERVER_STATUS] ${id}|${date} >>> ${process.env.PM2_PROJECT_NAME} => SERVER IS ERROR`
      );

      const obj = JSON.parse(JSON.stringify(result));
      const checkTypeResult = typeof obj;
      if (checkTypeResult === "object") {
        const { code } = obj;
        if (code === "ECONNREFUSED") {
          restartPm2ByName(process.env.PM2_PROJECT_NAME);
          writeLog_restartServer(
            `Restart Server ${process.env.PM2_PROJECT_NAME} is success.`,
            "RESTART_SERVER"
          );
        } else {
          console.log(
            `[CHECK_SERVER_STATUS] ${id}|${date} >>> ${process.env.PM2_PROJECT_NAME} => SERVER IS ERROR but not 'ECONNREFUSED'`
          );
        }
      } else {
        console.log(
          `[CHECK_SERVER_STATUS] ${id}|${date} >>> ${process.env.PM2_PROJECT_NAME} => SERVER IS ERROR but cannot convert to object`
        );
      }
    } else if (!checker) {
      console.log(
        `[CHECK_SERVER_STATUS] ${id}|${date} >>> ${process.env.PM2_PROJECT_NAME} => SERVER IS ERROR but has not result`
      );
    } else {
      console.log(
        `[CHECK_SERVER_STATUS] ${id}|${date} >>> ${process.env.PM2_PROJECT_NAME} => SERVER IS ACTIVE`
      );
    }
  } catch (error) {
    console.error(error);

    writeLog_throw(error, "resetBookingStatus");
    return;
  }
};

async function checkServerStatus() {
  const result = { checker: true, result: "error" };

  try {
    const basicAuth = Buffer.from(
      process.env.PM2_PROJECT_USERNAME + ":" + process.env.PM2_PROJECT_PASSWORD
    ).toString("base64");

    const checkServerStatus = await axios({
      url: `${process.env.PM2_PROJECT_URL}`,
      method: "get",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/json",
      },
    });

    if (checkServerStatus.data.res_code !== "0000") {
      throw new Error(checkServerStatus.data);
    }

    result.checker = false;
    result.result = checkServerStatus.data;
  } catch (error) {
    result.checker = true;
    result.result = error;
  }

  return result;
}
