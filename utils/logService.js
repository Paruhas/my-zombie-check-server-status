const winston = require("winston");
const dayjs = require("../libs/Day.js");
const fs = require("fs");

/* ===== LOG ZONE ===== */
const logDir = "./logs/info";
const logPath = () => {
  return `${logDir}/info_${dayjs().utc().format("YYYY-MM-DD")}.log`;
};
const throwDir = "./logs/error";
const throwLogPath = () => {
  return `${throwDir}/error_${dayjs().utc().format("YYYY-MM-DD")}.log`;
};
const reqDir = "./logs/request";
const reqPath = () => {
  return `${reqDir}/request_${dayjs().utc().format("YYYY-MM-DD")}.log`;
};
const restartServerDir = "./logs/restart";
const restartServerPath = () => {
  return `${restartServerDir}/restart_${dayjs()
    .utc()
    .format("YYYY-MM-DD")}.log`;
};

const tsFormat = () =>
  dayjs().utc().format("YYYY-MM-DD HH:mm:ss:SSS").toString();

if (!fs.existsSync(logDir)) {
  fs.mkdir(logDir, { recursive: true }, (err) => {
    if (err) {
      return console.log("create folder error: " + err);
    }
    console.log(`create folder successful at ${logDir}.`);
  });
}
if (!fs.existsSync(throwDir)) {
  fs.mkdir(throwDir, { recursive: true }, (err) => {
    if (err) {
      return console.log("create folder error: " + err);
    }
    console.log(`create folder successful at ${throwDir}.`);
  });
}
if (!fs.existsSync(reqDir)) {
  fs.mkdir(reqDir, { recursive: true }, (err) => {
    if (err) {
      return console.log("create folder error: " + err);
    }
    console.log(`create folder successful at ${reqDir}.`);
  });
}
if (!fs.existsSync(restartServerDir)) {
  fs.mkdir(restartServerDir, { recursive: true }, (err) => {
    if (err) {
      return console.log("create folder error: " + err);
    }
    console.log(`create folder successful at ${restartServerDir}.`);
  });
}

let loggers;
let throwLoggers;
let requestLoggers;
let restartServerLoggers;

function CreateNewLoggers(level = "info", filename = null) {
  return winston.createLogger({
    level: level,
    format: winston.format.json(),
    transports: [
      new winston.transports.File({
        filename: filename || logPath(),
        format: winston.format.combine(
          winston.format.timestamp({ format: tsFormat() })
        ),
        handleExceptions: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
      }),
    ],
  });
}

function StartLogger() {
  try {
    console.log("+++ Logger Starting... +++");

    if (loggers) {
      loggers.clear();
    }
    if (throwLoggers) {
      throwLoggers.clear();
    }
    if (requestLoggers) {
      requestLoggers.clear();
    }
    if (restartServerLoggers) {
      restartServerLoggers.clear();
    }

    loggers = CreateNewLoggers("info", logPath());
    throwLoggers = CreateNewLoggers("error", throwLogPath());
    requestLoggers = CreateNewLoggers("info", reqPath());
    restartServerLoggers = CreateNewLoggers("info", restartServerPath());

    console.log("+++++ Logger SUCCESS +++++");
  } catch (error) {
    console.log("++++++ Logger FAIL ++++++");
  } finally {
  }
}

const writeLog_info = (error) => {
  const logs = loggers || CreateNewLoggers("info", logPath());

  if (!loggers) {
    StartLogger();
  }

  const logDateTime = `${dayjs().utc().format("YYYY-MM-DD HH:mm:ss:SSSZ")}`;

  logs.log({
    time: logDateTime,
    level: "error",
    ...error,
  });

  return;
};

const writeLog_throw = (error, key) => {
  const logs = throwLoggers || CreateNewLoggers("error", throwLogPath());

  if (!throwLoggers) {
    StartLogger();
  }

  const logDateTime = `${dayjs().utc().format("YYYY-MM-DD HH:mm:ss:SSSZ")}`;

  logs.log({
    time: logDateTime,
    level: "error",
    key,
    error: (error && error.message) || "",
  });

  return;
};

const writeLog_request = (id, date, method, originalUrl, req) => {
  const { body, query, params } = req;

  const logs = requestLoggers || CreateNewLoggers("info", reqPath());

  if (!requestLoggers) {
    StartLogger();
  }

  const logDateTime = `${dayjs().utc().format("YYYY-MM-DD HH:mm:ss:SSSZ")}`;

  logs.log({
    level: "info",
    time: logDateTime,
    id,
    date,
    method,
    originalUrl,
    params,
    query,
    body,
  });

  return;
};

const writeLog_restartServer = (message, key) => {
  const logs =
    restartServerLoggers || CreateNewLoggers("info", restartServerPath());

  if (!restartServerLoggers) {
    StartLogger();
  }

  const logDateTime = `${dayjs().utc().format("YYYY-MM-DD HH:mm:ss:SSSZ")}`;

  logs.log({
    level: "info",
    time: logDateTime,
    key,
    message,
  });

  return;
};

module.exports = {
  StartLogger,
  writeLog_info,
  writeLog_throw,
  writeLog_request,
  writeLog_restartServer,
};
